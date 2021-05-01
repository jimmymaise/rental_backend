import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('FACEBOOK_APP_ID'),
      clientSecret: configService.get('FACEBOOK_APP_SECRET'),
      callbackURL: configService.get('FACEBOOK_LOGIN_CALLBACK_URL'),
      scope: 'email',
      profileFields: ['id', 'displayName', 'link', 'photos', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { id, displayName, emails } = profile;
    const user = {
      facebookId: id,
      email: emails[0].value,
      displayName,
    };
    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}
