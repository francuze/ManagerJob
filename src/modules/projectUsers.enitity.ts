import { Table, Model, Column, DataType, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Project } from './projects.enitity';
import { User } from './user.entity';

@Table
export class ProjectUser extends Model<ProjectUser> {
  @ForeignKey(() => Project)
  @Column
  projectId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;
}