/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Body,
  Res,
  HttpStatus,
  Delete,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { DataService } from 'src/data/data.service';
import { ProjectService } from './project.service';

@UseGuards(AuthGuard('custom'))
@Controller()
export class ProjectController {
  constructor(
    private readonly dataService: DataService,
    private readonly projectService: ProjectService,
  ) {}

  @Get('projects')
  getAllUserProjects(@Request() req: any): any {
    const { preferred_username } = req.user;
    return this.projectService.findMyProject(preferred_username);
  }

  @Post('project')
  createProject(@Request() req: any, @Body() metaData: any, @Res() res): any {
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
    const project_name = metaData.project_name;

    // generate valid file name from project_name
    const workbench_name = `H1st${project_name
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '')}`;

    this.projectService
      .createNewProject({
        preferred_username,
        name,
        picture,
        project_name,
        workbench_name,
      })
      .catch((ex) => res.status(400).send({ status: 'error', msg: ex }))
      .then((data) => res.status(HttpStatus.OK).send(data));
  }

  @Get('project/:id')
  getProjectInfo(@Param('id') id, @Request() req): any {
    const { preferred_username } = req.user;
    return this.dataService.getProjectInfo(id, preferred_username);
  }

  @Delete('project/:id')
  deleteProject(@Param('id') id, @Request() req): any {
    const { preferred_username } = req.user;
    this.dataService.deleteProject(id, preferred_username);

    return this.projectService.deleteProject(id);
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
