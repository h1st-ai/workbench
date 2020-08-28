export interface IDashboardSlice {
  viewMode: string;
  searchKeyword: string;
  projects: IProject[];
}

export interface IProject {
  author_username: string;
  author_name: string;
  name: string;
  workspace: string;
  status: boolean;
  collaborators?: IProjectCollaborator[];
  author_picture?: string;
  updated_at: Date;
  created_at: Date;
}

export interface IProjectCollaborator {
  username: string;
  firstName: string;
  lastName: string;
  picture: string;
}

export interface IStore {
  dashboard: IDashboardSlice;
}
