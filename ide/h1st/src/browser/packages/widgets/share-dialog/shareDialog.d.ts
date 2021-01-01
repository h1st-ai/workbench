interface Collaborator {
  avatar: string;
  name: string;
  email: string;
  isOwner: boolean;
  deleteShare: Function;
  data: IShareItem;
}

export { Collaborator };
