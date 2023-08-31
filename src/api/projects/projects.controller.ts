import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Req,
  Param,
  Put,
  Delete
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from 'src/guards/JwtAuthGuard';
import { CreateProjectDTO } from './dto/create-project.dto';
import { User } from 'src/modules/user.entity';
import { CurrentUser } from '../auth/dto/current-user.decorator';
import { Project } from 'src/modules/projects.enitity';
import { UpdateProjectDTO } from './dto/update-project.dto';

@ApiTags('projects')
@ApiBearerAuth('access-token')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllProjects(@Req() req, @CurrentUser() user: User, ) {
    
    return this.projectsService.getProjects(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createProject(
    @Body() createProjectDTO: CreateProjectDTO,
    @CurrentUser() user: User, // Используйте ваш декоратор для получения текущего пользователя
  ): Promise<Project> {
    // Вызов сервисной функции для создания проекта
    return this.projectsService.createProject(createProjectDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:projectId')
  async updateProject(@Param('projectId') projectId: number, @Body() updateProjectDTO: UpdateProjectDTO) {
    return await this.projectsService.updateProject(projectId, updateProjectDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:projectId')
  async deleteProject(@Param('projectId') id: number, @CurrentUser() user: User) {
    
    return this.projectsService.deleteProject(id,user.id);
  }  
}
