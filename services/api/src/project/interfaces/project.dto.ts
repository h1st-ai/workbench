export class ProjectDto {
  readonly id: string;
  readonly name: string;
  readonly author_name: number;
  readonly author_username?: string;
  readonly workspace: string;
  readonly status: string;
  readonly author_picture?: string;
  readonly updated_at?: Date;
  readonly created_at?: Date;
}
