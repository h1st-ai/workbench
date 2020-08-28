import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: any): Promise<any> {
    console.log('validating ', req);

    const { authorization } = req.headers;
    const user = await this.authService.validateUser(authorization);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
