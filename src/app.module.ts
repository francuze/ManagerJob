import { Module,NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './api/auth/auth.service';
import { AuthController } from './api/auth/auth.controller';
import { User } from './modules/user.entity';
import { UserService } from './user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './api/auth/constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/jwt.strategy';
import { ProjectsController } from './api/projects/projects.controller';
import { ProjectsService } from './api/projects/projects.service';
import { Project } from './modules/projects.enitity';
import { ProjectUser } from './modules/projectUsers.enitity';
import { ProjectMiddleware } from './project.middleware';

@Module({
  imports: [SequelizeModule.forRoot({
    dialect: 'mysql', // Подставьте используемую вами базу данных
    host: '127.0.0.1', // Подставьте ваш хост
    port: 3306, // Подставьте порт вашей базы данных
    username: 'root', // Подставьте ваше имя пользователя базы данных
    password: '', // Подставьте ваш пароль
    database: 'ManagerJob', // Подставьте название вашей базы данных
    autoLoadModels: true,
    synchronize: true, // ВНИМАНИЕ: это свойство будет синхронизировать модели с базой данных, используйте только в разработке
  }),
  SequelizeModule.forFeature([User,Project,ProjectUser]),
  PassportModule,
  JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '1h' },
  }),
],
  controllers: [AuthController, ProjectsController],
  providers: [AuthService, UserService,JwtStrategy, ProjectsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProjectMiddleware)
      .forRoutes('*'); // Применить middleware ко всем роутам
  }
}
