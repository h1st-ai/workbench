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
      "name": "Foo Bar",
      "preferred_username": "user@gmail.com",
      "given_name": "Foo",
      "family_name": "Bar",
      "picture": "https://lh3.googleusercontent.com/a-/AOh14GjouHQcSq2gPdOmRJW",
      "email": "user@gmail.com"
    } 
    */
    const { preferred_username, name, picture } = req.user;
    const { project_name, cpu, ram, gpu } = metaData;

    const workbench_name = project_name;

    this.projectService
      .createNewProject({
        preferred_username,
        name,
        picture,
        project_name,
        workbench_name,
        cpu,
        ram,
        gpu,
      })
      .catch(ex => res.status(400).send({ status: 'error', msg: ex }))
      .then(data => res.status(HttpStatus.OK).send(data));
  }

  @Get('project/:id')
  getProjectInfo(@Param('id') id, @Request() req): any {
    const { preferred_username } = req.user;
    return this.dataService.getProjectInfo(id, preferred_username);
  }

  @Get('project/:id/shares')
  getProjectSharings(@Param('id') id, @Request() req): any {
    const { preferred_username } = req.user;
    return this.dataService.getProjectSharings(id, preferred_username);
  }

  @Post('project/:id/shares')
  addProjectSharings(@Param('id') id, @Request() req, @Body() items: any): any {
    const { preferred_username } = req.user;
    return this.dataService.addProjectSharings(id, preferred_username, items);
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
