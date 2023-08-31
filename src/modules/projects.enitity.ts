import { Table, Model, Column, DataType, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.entity';
import { ProjectUser } from './projectUsers.enitity';

@Table
export class Project extends Model<Project> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ForeignKey(() => User)
  @Column
  ownerId: number; // Идентификатор владельца проекта

  @BelongsToMany(() => User, () => ProjectUser)
  users: User[];
}
