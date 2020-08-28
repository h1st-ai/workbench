import { Project } from './projects.entity';
import { EntityRepository, Repository } from 'typeorm';
import { ProjectDto } from './interfaces/project.dto';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  createNewProject = async (projectDto: Project) => {
    console.log('when was this invoked?');
    return await this.save([projectDto]);
  };
}
