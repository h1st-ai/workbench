import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { ProjectModule } from './project/project.module';
import { DataService } from './data/data.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TypeOrmModule.forRoot(),
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataService],
})
export class AppModule {}
