import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './projects.entity';
import { ProjectRepository } from './projects.repository';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectRepository])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
