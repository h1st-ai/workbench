import {
  Resource,
  Roles,
  Scopes,
  AllowAnyRole,
  Public,
} from 'nest-keycloak-connect';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @AllowAnyRole()
  getHeartBeat(): string {
    return this.appService.getHeartBeat();
  }
}
