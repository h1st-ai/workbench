import { Project } from './projects.entity';
import { EntityRepository, Repository } from 'typeorm';
import { ProjectDto } from './interfaces/project.dto';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  createNewProject = async (project: Project): Promise<any> => {
    return await this.save([project]);
  };

  findMyProjects = async (author_username: string): Promise<any> => {
    return await this.find({ author_username });
  };
}
