import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('custom'))
  @Get()
  getHeartBeat(): string {
    return this.appService.getHeartBeat();
  }
}
