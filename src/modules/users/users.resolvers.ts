import { UseGuards, BadRequestException } from '@nestjs/common';
import {
  Args,
  Resolver,
  Mutation,
  Query,
  Context,
  Info,
} from '@nestjs/graphql';
import { GraphQLFieldHandler } from '@helpers/handlers/graphql-field-handler';

import { UsersService } from './users.service';
import { AdminUsersService } from './admin-users.service';
import { GuardUserPayload, AuthDTO } from '../auth/auth.dto';
import { GqlAuthGuard } from '../auth/gpl-auth.guard';
import { GqlRefreshGuard } from '../auth/gpl-request.guard';
import { EveryoneGqlAuthGuard } from '../auth/everyone-gpl-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  UserInfoInputDTO,
  UserInfoDTO,
  PublicUserInfoDTO,
} from './user-info.dto';
import { OffsetPaginationDTO } from '../../models';
import { Permission } from '@modules/auth/permission/permission.enum';
// Internal for only UI UserPermission
import { Permission as UserPermission } from './permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { AuthService } from '@modules/auth/auth.service';
import { GqlPermissionsGuard } from '@modules/auth/permission/gql-permissions.guard';
import { ErrorMap } from '@app/constants';
import { EmailService } from '@modules/mail/mail.service';
import { GraphQLResolveInfo } from 'graphql';

@Resolver('User')
export class UsersResolvers {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly adminUserService: AdminUsersService,
  ) {}

  @Query()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async whoAmI(
    @CurrentUser() user: GuardUserPayload,
    @Info() info: GraphQLResolveInfo,
  ): Promise<UserInfoDTO> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForRelationalFields([
      'currentOrgDetail',
      'orgDetails',
    ]);

    return this.userService.getUserDetailData(user.id, true, include);
  }

  @Query()
  @Permissions(Permission.NO_NEED_LOGIN)
  @UseGuards(EveryoneGqlAuthGuard)
  async userPublicProfile(
    @CurrentUser() user: GuardUserPayload,
    @Args('userId') userId: string,
  ): Promise<PublicUserInfoDTO> {
    const allData = await this.userService.getUserDetailData(userId);
    const permissions: string[] = [];

    if (user) {
      if (user.id !== allData.id) {
        permissions.push(UserPermission.SEND_MESSAGE);

        if (await this.userService.isUserInMyContactBook(user.id, allData.id)) {
          permissions.push(UserPermission.REMOVE_CONNECT);
        } else {
          permissions.push(UserPermission.CONNECT);
        }
      }

      if (user.id === allData.id) {
        permissions.push(UserPermission.EDIT_PROFILE);
      }
    }

    return {
      id: allData.id,
      orgIds: allData.orgIds,
      currentOrgId: allData.currentOrgId,
      displayName: allData.displayName,
      bio: allData.bio,
      avatarImage: allData.avatarImage,
      coverImage: allData.coverImage,
      createdDate: allData.createdDate,
      permissions,
    };
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.NEED_LOGIN)
  async updateUserInfoData(
    @CurrentUser() user: GuardUserPayload,
    @Args('userInfoData') userInfoData: UserInfoInputDTO,
  ): Promise<UserInfoDTO> {
    return this.userService.updateUserProfile(user.id, userInfoData);
  }

  // SIGN-IN - SIGN-UP
  @Mutation()
  @Permissions(Permission.NO_NEED_LOGIN)
  async signUpByEmail(
    @Context() context: any, // GraphQLExecutionContext
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthDTO> {
    let result;

    try {
      result = await this.userService.signUpByEmail(email, password);
    } catch (err) {
      throw new BadRequestException(ErrorMap.EMAIL_EXISTED);
    }

    const { accessToken, refreshToken, ...restProps } = result;

    await this.userService.setCurrentRefreshToken(
      refreshToken,
      restProps.user.id,
    );

    const accessTokenCookie =
      this.authService.getCookieWithJwtAccessToken(accessToken);
    const refreshTokenCookie =
      this.authService.getCookieWithJwtRefreshToken(refreshToken);

    context.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return {
      ...restProps,
      accessToken,
      refreshToken,
    };
  }

  @Mutation()
  @Permissions(Permission.NO_NEED_LOGIN)
  async loginByEmail(
    @Context() context: any, // GraphQLExecutionContext
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthDTO> {
    let result;

    try {
      result = await this.userService.loginByEmail(email, password);
    } catch (err) {
      throw new BadRequestException(ErrorMap.EMAIL_OR_PASSWORD_INVALID);
    }

    const { accessToken, refreshToken, ...restProps } = result;

    await this.userService.setCurrentRefreshToken(
      refreshToken,
      restProps.user.id,
    );

    const accessTokenCookie =
      this.authService.getCookieWithJwtAccessToken(accessToken);
    const refreshTokenCookie =
      this.authService.getCookieWithJwtRefreshToken(refreshToken);
    context.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return {
      ...restProps,
      accessToken,
      refreshToken,
    };
  }

  @Mutation()
  @UseGuards(GqlRefreshGuard)
  @Permissions(Permission.NEED_LOGIN)
  async refreshUserAccessToken(
    @Context() context: any, // GraphQLExecutionContext
    @CurrentUser() currentUser: GuardUserPayload,
    @Args('refresh') refresh: string,
  ): Promise<AuthDTO> {
    const user = await this.userService.getUserById(currentUser.id);
    const token = await this.authService.generateNewToken(null, user.id);

    const accessToken = token.accessToken;
    const accessTokenCookie =
      this.authService.getCookieWithJwtAccessToken(accessToken);
    context.res.setHeader('Set-Cookie', accessTokenCookie);

    return {
      accessToken,
      user,
    };
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.NEED_LOGIN)
  async logout(
    @Context() context: any,
    @CurrentUser() currentUser: GuardUserPayload,
  ) {
    try {
      await this.userService.removeRefreshToken(currentUser.id);
    } catch {}

    const tokenHeaderCookie = this.authService.getCookieForLogout();
    context.res.setHeader('Set-Cookie', tokenHeaderCookie);

    return true;
  }

  @Mutation()
  @Permissions(Permission.NO_NEED_LOGIN)
  async requestResetPassword(
    @Args('email') email: string,
    @Args('recaptchaKey') recaptchaKey: string,
  ): Promise<string> {
    const isRecaptchaKeyVerified =
      await this.authService.verifyRecaptchaResponse(recaptchaKey);

    if (!isRecaptchaKeyVerified) {
      throw new BadRequestException(ErrorMap.RECAPTCHA_RESPONSE_KEY_INVALID);
    }

    try {
      const { token, displayName } =
        await this.userService.generateResetPasswordToken(email);
      await this.emailService.sendResetPasswordEmail(displayName, email, token);
      return email;
    } catch (err) {
      return email;
    }
  }

  @Mutation()
  @Permissions(Permission.NO_NEED_LOGIN)
  async setPasswordByToken(
    @Args('token') token: string,
    @Args('password') password: string,
  ): Promise<string> {
    try {
      const user = await this.userService.updatePasswordByToken(
        token,
        password,
      );

      return user.email;
    } catch (err) {
      throw new BadRequestException(ErrorMap.REFRESH_PASSWORD_TOKEN_INVALID);
    }
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.NEED_LOGIN)
  async changePassword(
    @Context() context: any, // GraphQLExecutionContext
    @CurrentUser() currentUser: GuardUserPayload,
    @Args('currentPassword') currentPassword: string,
    @Args('newPassword') newPassword: string,
  ): Promise<AuthDTO> {
    const { accessToken, refreshToken, ...restProps } =
      await this.userService.changeUserPassword(
        currentUser.id,
        currentPassword,
        newPassword,
      );

    const accessTokenCookie =
      this.authService.getCookieWithJwtAccessToken(accessToken);
    const refreshTokenCookie =
      this.authService.getCookieWithJwtRefreshToken(refreshToken);
    context.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return {
      ...restProps,
      accessToken,
      refreshToken,
    };
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.NEED_LOGIN)
  async deleteMyUser(
    @CurrentUser() currentUser: GuardUserPayload,
    @Args('reason') reason: string,
    @Args('recaptchaKey') recaptchaKey: string,
  ): Promise<boolean> {
    const isRecaptchaKeyVerified =
      await this.authService.verifyRecaptchaResponse(recaptchaKey);

    if (!isRecaptchaKeyVerified) {
      throw new BadRequestException(ErrorMap.RECAPTCHA_RESPONSE_KEY_INVALID);
    }

    try {
      await this.userService.deleteUser(currentUser.id, reason);
      return true;
    } catch (err) {
      return false;
    }
  }

  // FOR ADMIN ONLY
  @Query()
  @Permissions('ROOT')
  @UseGuards(GqlPermissionsGuard)
  async adminUserListFeed(
    @Args('query')
    query: {
      search: string;
      offset: number;
      limit: number;
      sortByFields: string[];
    },
  ): Promise<OffsetPaginationDTO<UserInfoDTO>> {
    const { search, offset, limit, sortByFields } = query || {};
    const actualLimit = limit && limit > 100 ? 100 : limit;

    const result = await this.adminUserService.findAllUsers({
      searchValue: search,
      offset,
      limit: actualLimit,
      sortByFields,
    });

    return {
      items: result.items,
      total: result.total,
      offset: offset || 0,
      limit: actualLimit,
    };
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.ORG_MASTER, Permission.FIND_USER_INFO)
  async findUserInfoByEmailPhoneNumber(
    @Args('searchValue') searchValue: string,
  ): Promise<PublicUserInfoDTO[]> {
    // avoid crawl data
    if (searchValue.length < 3) {
      return [];
    }

    // avoid crawl data
    const finalSearchValue = searchValue.replace(
      /\@gmail|\.com|\.vn|\.net|\@yahoo|\@live/gi,
      '',
    );

    const result = await this.userService.findByEmailOrPhoneNumber(
      finalSearchValue,
    );

    return result.map((user: UserInfoDTO) => ({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarImage: user.avatarImage,
      createdDate: user.createdDate,
      phoneNumber: user.phoneNumber,
    }));
  }
}
