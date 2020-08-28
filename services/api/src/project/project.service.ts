import { Injectable } from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { ProjectRepository } from './projects.repository';
import { InjectRepository } from '@nestjs/typeorm';

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
        .where('project.author_username = :author_username', {
          author_username,
        })
        .getMany();

      // update table with newest status
      const mappedTable = {};

      remoteData.items.forEach((i) => {
        mappedTable[i.workbench_id] = i.status;
      });

      result = result.map((p) => {
        if (mappedTable[p.id]) {
          return { ...p, status: mappedTable[p.id] };
        }

        return { ...p };
      });

      console.log('result ', result);
      return result;
    }

    return result;
  }

  async createNewProject(data: any) {
    const { preferred_username, picture, project_name, name } = data;
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
    const remoteData: any = await this.dataService.createProject(
      preferred_username,
    );

    if (remoteData.success === true) {
      try {
        const commitResult = await this.projectRepository.createNewProject({
          id: remoteData.item.workbench_id,
          name: project_name,
          author_name: name,
          author_username: preferred_username,
          author_picture: picture,
          status: 'starting', // set starting by default
          workspace: `https://cloud.h1st.ai/project/${remoteData.item.workbench_id}`,
        });

        console.log('commitResult ', commitResult);

        return {
          item: commitResult,
          status: 'success',
        };
      } catch (e) {
        return {
          status: 'error',
          error: 'Error saving project',
        };
      }
    } else {
      return {
        status: 'error',
        error: 'Error creating project',
      };
    }
  }
}
