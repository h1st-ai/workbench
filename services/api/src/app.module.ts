import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { DataService } from './data/data.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [AppController, ProjectController],
  providers: [AppService, ProjectService, DataService],
})
export class AppModule {}
