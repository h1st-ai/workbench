import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { KeycloakStrategy } from './keycloak.strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthService, KeycloakStrategy],
})
export class AuthModule {}
