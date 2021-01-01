export interface IDashboardSlice {
  viewMode: string;
  searchKeyword: string;
  projects: IProject[];
  showCreateProjectDialog: boolean;
  currentProjectStatus: string | null;
  pollingProjectId: string | null;
}

export interface IProject {
  id: string;
  author_username: string;
  author_name: string;
  name: string;
  workspace: string;
  status: string;
  collaborators?: IProjectCollaborator[];
  author_picture?: string;
  ram: number;
  cpu: number;
  gpu?: number;
  updated_at: Date;
  created_at: Date;
  index: number;
}

export interface IProjectCollaborator {
  username: string;
  firstName: string;
  lastName: string;
  picture: string;
}

export interface IAuthSlice {
  token: String;
}

export interface IStore {
  auth: IAuthSlice;
  dashboard: IDashboardSlice;
}
