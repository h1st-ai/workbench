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
    return this.dataService.getAllProjects(preferred_username);
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

    this.projectService
      .createNewProject({
        preferred_username,
        name,
        picture,
        project_name,
      })
      .catch((ex) => res.status(400).send({ status: 'error', msg: ex }))
      .then((data) => res.status(HttpStatus.OK).send(data));

    // return remoteData;
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

    // remoteData.then((data) => {
    //   if (data.success === true) {
    //     console.log(
    //       'metaData ',
    //       metaData.project_name,
    //       preferred_username,
    //       name,
    //       picture,
    //     );

    //     this.projectRepository
    //       .createNewProject({
    //         id: data.item.workbench_id,
    //         name: metaData.project_name,
    //         author_name: name,
    //         author_username: preferred_username,
    //         author_picture: picture,
    //         status: 'starting', // set starting by default
    //         workspace: `https://cloud.h1st.ai/project/${data.item.workbench_id}`,
    //       })
    //       .then((savedData) => {
    //         console.log('commitResult', savedData);

    //         return res.json({
    //           item: savedData,
    //           status: 'success',
    //         });
    //       })
    //       .catch((ex) => {
    //         console.log('error saving db', ex);

    //         return {
    //           status: 'error',
    //         };
    //       });
    //   } else {
    //     return {
    //       status: 'error',
    //       error: 'Error creating project',
    //     };
    //   }
    // });
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
