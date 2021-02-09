import { Injectable } from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { ProjectRepository } from './projects.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './projects.entity';

@Injectable()
export class ProjectService {
  constructor(
    private readonly dataService: DataService,
    @InjectRepository(ProjectRepository)
    private readonly projectRepository: ProjectRepository,
  ) {}
  async findMyProject(author_username: string) {
    const remoteData: any = await this.dataService.getAllProjects(
      author_username,
    );

    let result = [];

    if (remoteData.success === true) {
      result = await this.projectRepository
        .createQueryBuilder('project')
        .where('project.id in (:...project_ids)', {
          project_ids: remoteData.items.map(item => item.workbench_id),
        })
        .getMany();

      // update table with newest status
      const mappedTable = {};

      remoteData.items.forEach(i => {
        mappedTable[i.workbench_id] = {
          status: i.status,
          cpu: i.requested_cpu,
          ram: i.requested_memory,
          gpu: i.requested_gpu,
        };
      });

      result = result.map(p => {
        if (mappedTable[p.id]) {
          return { ...p, ...mappedTable[p.id] };
        }

        return { ...p };
      });

      result.sort((a, b) => b.created_at - a.created_at);

      return { status: 'success', items: result };
    } else {
      return { status: 'error' };
    }
  }

  async deleteProject(id: string) {
    try {
      console.log("'Deleting project");
      const result = await this.projectRepository
        .createQueryBuilder('project')
        .delete()
        .from(Project)
        .where('id = :id', { id })
        .execute();

      return {
        item: result,
        status: 'success',
      };
    } catch (error) {
      console.log('Cannot delete project', error);
    }
  }

  async createNewProject(data: any) {
    const {
      preferred_username,
      picture,
      project_name,
      name,
      workbench_name,
      cpu,
      ram,
      gpu,
    } = data;
    // retrieve data from the remote rest API

    /* 
      remoteData looks like this when success
      {
        "item": {
          "user_id": "khoama@gmail.com",
          "workbench_id": "6dsqyebqwm"
        },
        "success": true
      }
    */
    const remoteData: any = await this.dataService.createProject({
      username: preferred_username,
      workbench_name,
      cpu,
      ram,
      gpu,
    });

    if (remoteData.success === true) {
      try {
        console.log('remoteData', remoteData);
        const commitResult = await this.projectRepository.createNewProject({
          id: remoteData.item.workbench_id,
          name: project_name,
          author_name: name,
          author_username: preferred_username,
          author_picture: picture,
          status: 'starting', // set starting by default
          workspace: workbench_name,
          cpu,
          ram,
          gpu,
        });

        console.log('commitResult ', commitResult);

        return {
          item: {
            id: remoteData.item.workbench_id,
            name: project_name,
            author_name: name,
            author_username: preferred_username,
            author_picture: picture,
            status: 'starting', // set starting by default
            workspace: workbench_name,
          },
          status: 'success',
        };
      } catch (e) {
        console.log(e);
        return {
          status: 'error',
          error: 'Error saving project',
        };
      }
    } else {
      console.log('remoteData', remoteData);
      return {
        status: 'error',
        error: 'Error creating project',
      };
    }
  }
}
