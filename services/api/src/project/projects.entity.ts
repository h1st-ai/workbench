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

  @Column({ nullable: true })
  cpu: number;

  @Column({ nullable: true })
  ram: number;

  @Column({ nullable: true })
  gpu: number;

  @Column({ length: 20, default: 'running' })
  status: string;

  @Column({
    length: 255,
    nullable: true,
    default: 'http://static.h1st.ai/user/default.png',
  })
  author_picture?: string;

  @UpdateDateColumn()
  updated_at?: Date;

  @CreateDateColumn()
  created_at?: Date;
}
