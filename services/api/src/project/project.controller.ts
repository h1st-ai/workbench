import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Body,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '@nestjs/passport';
import { DataService } from 'src/data/data.service';
import { ProjectRepository } from './projects.repository';

@UseGuards(AuthGuard('custom'))
@Controller()
export class ProjectController {
  constructor(
    private readonly dataService: DataService,
    @InjectRepository(ProjectRepository)
    private readonly projectRepository: ProjectRepository,
  ) {}

  @Get('projects')
  getAllUserProjects(@Request() req): any {
    const { preferred_username } = req.user;
    return this.dataService.getAllProjects(preferred_username);
  }

  @Post('project')
  createProject(@Request() req, @Body() metaData: any): any {
    /*
    req.user looks like this
    {
      "sub": "86512224-dffa-490f-bc6f-ae56cda70845",
      "email_verified": false,
      "name": "Khoa Ma",
      "preferred_username": "khoama@gmail.com",
      "given_name": "Khoa",
      "family_name": "Ma",
      "picture": "https://lh3.googleusercontent.com/a-/AOh14GjouHQcSq2gPdOmRJWautCUsp7hk2L9TjW-noI16PQ",
      "email": "khoama@gmail.com"
    }
    */
    const { preferred_username, name, picture } = req.user;
    // retrieve data from the remote rest API
    console.log('retrieving from remote');

    const remoteData: any = this.dataService.createProject(preferred_username);

    console.log('remoteData', remoteData);
    /* 
      remoteData looks like this
      {
        "item": {
          "user_id": "khoama@gmail.com",
          "workbench_id": "6dsqyebqwm"
        },
        "success": true
      }
    */
    if (remoteData.success === true) {
      const { project_name } = metaData;

      const commitResult = this.projectRepository.createNewProject({
        id: remoteData.item.workbench_id,
        name: project_name,
        author_name: name,
        author_username: preferred_username,
        author_picture: picture,
        status: 'starting', // set starting by default
        workspace: `https://cloud.h1st.ai/project/${remoteData.item.workbench_id}`,
      });

      console.log('commitResult', commitResult);

      return commitResult;
    } else {
      return {
        error: 'Error creating project',
      };
    }
  }

  @Get('project/:id')
  getProjectInfo(@Param('id') id, @Request() req): any {
    const { preferred_username } = req.user;
    return this.dataService.getProjectInfo(id, preferred_username);
  }

  @Post('project/:id/start')
  startProject(@Param('id') id, @Request() req): any {
    const { preferred_username } = req.user;
    return this.dataService.startProject(id, preferred_username);
  }

  @Post('project/:id/stop')
  stopProject(@Param('id') id, @Request() req): any {
    const { preferred_username } = req.user;
    return this.dataService.stopProject(id, preferred_username);
  }
}
