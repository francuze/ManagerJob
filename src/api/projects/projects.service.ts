import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from 'src/modules/projects.enitity';
import { ProjectUser } from 'src/modules/projectUsers.enitity';
import { UserService } from 'src/user/user.service';
import { CreateProjectDTO } from './dto/create-project.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/modules/user.entity';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { Op } from 'sequelize';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private projectModel: typeof Project,
    private userService: UserService,
  ) {}

  async createProject(createProjectDTO: CreateProjectDTO): Promise<Project> {
    const { title, description, users, ownerId } = createProjectDTO;

    const project = await this.projectModel.create({
      title,
      description,
      ownerId,
    });

    if (users && users.length > 0) {
      const usersToAdd = await this.userService.findByIds(users);
      if (usersToAdd.length > 0) {
        await project.$add('users', usersToAdd);
      }
    }

    return project;
  }
  async getProjects(userId: number): Promise<Project[]> {
    try {
      const projects = await Project.findAll({
        where: {
          [Op.or]: [
            {
              ownerId: {
                [Op.eq]: userId,
              },
            },
            {
              '$users.id$': {
                [Op.eq]: userId,
              },
            },
          ],
        },
        include: {
          model: User,
          as: 'users',
        },
      });
      return projects;
    } catch (error) {
      throw new Error('Не удалось выполнить поиск проектов.');
    }
  }  
  async IsOwner(ownerId: number, id: number): Promise<Project[]> {
    let project = await this.projectModel.findAll({
      where: {
        ownerId,
        id
      }
    });
    if(!project) {
      return null
    } else {
      return project
    }
  }
  async getProject(id: number): Promise<Project> {
    return this.projectModel.findOne({
      where: {
        id,
      },
    });
  }
  async updateProject(projectId: number, updateProjectDTO: UpdateProjectDTO): Promise<Project> {
    const project = await this.getProject(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await project.update(updateProjectDTO);

    return project;
  }
  async deleteProject(id: number,userId: number): Promise<Project> {
    
    const project = await this.getProject(id);
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    console.log(await this.IsOwner(userId,id));
    
    if(!await this.IsOwner(userId,id)) {
      throw new NotFoundException('You are not the owner of this project');
    }
    //await project.destroy();

    return project;
  }

}
