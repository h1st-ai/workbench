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
  async createNewProject(data: any) {
    const { preferred_username, picture, project_name, name } = data;
    // retrieve data from the remote rest API
    const remoteData: any = await this.dataService.createProject(
      preferred_username,
    );

    console.log('remoteData', remoteData);

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
