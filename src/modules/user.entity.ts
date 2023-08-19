import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
  })
  lastName: string;

  // Добавьте другие поля, если необходимо

  // Метод для сравнения пароля
  async comparePassword(attempt: string): Promise<boolean> {
    return this.password === attempt;
  }
}