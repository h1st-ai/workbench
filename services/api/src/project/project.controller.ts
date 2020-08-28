import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DataService } from 'src/data/data.service';

@UseGuards(AuthGuard('custom'))
@Controller()
export class ProjectController {
  constructor(private readonly dataService: DataService) {}

  @Get('projects')
  getAllUserProjects(@Request() req): any {
    const { preferred_username } = req.user;
    return this.dataService.getAllProjects(preferred_username);
  }

  @Post('project')
  createProject(@Param('id') id, @Request() req): any {
    const { preferred_username } = req.user;
    return this.dataService.createProject(preferred_username);
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
