export interface IDashboardSlice {
  viewMode: string;
  searchKeyword: string;
  projects: IProject[];
}

export interface IProject {
  owner: string;
  name: string;
  workspace: string;
  status: string;
  collaborators: IProjectCollaborator[];
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
