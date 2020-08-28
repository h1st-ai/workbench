import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryColumn()
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  author_username: string;

  @Column({ length: 50 })
  author_name: string;

  @Column({ length: 120 })
  workspace: string;

  @Column({ length: 20, default: 'running' })
  status: string;

  @Column({ length: 255 })
  author_picture?: string;

  @UpdateDateColumn()
  updated_at?: Date;

  @CreateDateColumn()
  created_at?: Date;
}
