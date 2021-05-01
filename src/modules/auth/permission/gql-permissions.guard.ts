import { ExtractJwt } from 'passport-jwt';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  Permission,
  ORG_OWNER_PERMISSION,
} from '@modules/auth/permission/permission.enum';

import { AuthService } from '../auth.service';

// TODO: NOT COMPLETED YET
@Injectable()
export class GqlPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!permissions) {
      // To avoid  mistake let the permissions empty, We must not authorize it as well
      return false;
    }
    if (permissions.includes(Permission.NO_NEED_LOGIN)) {
      return true;
    }

    try {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;

      const token = ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.Authentication;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ])(request);

      const user = this.authService.decodeJwtToken(token);
      if (user && permissions.includes(Permission.NEED_LOGIN)) {
        return true;
      }
      let currentUserPermissionNames = user?.currentOrgPermissionNames;
      user?.currentOrgPermissionNames;
      if (user.isCurrentOrgOwner == true) {
        currentUserPermissionNames.push(...ORG_OWNER_PERMISSION);
        return true;
      }

      let isAuthenticated = false;
      for (let i = 0; i < currentUserPermissionNames?.length; i++) {
        if (permissions.includes(user?.permissions[i])) {
          isAuthenticated = true;
          break;
        }
      }

      return isAuthenticated;
    } catch {
      return false;
    }
  }
}
