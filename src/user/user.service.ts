import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from '../modules/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    return await this.userModel.create(createUserDTO);
  }

  async findById(id: number): Promise<User> {
    const user = await this.userModel.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({
      where: { email },
    });
  }

  async updateUser(id: number, updateUserDTO: UpdateUserDTO): Promise<User> {
    const user = await this.findById(id);

    await user.update(updateUserDTO);

    return user;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findById(id);
    await user.destroy();
  }
}
