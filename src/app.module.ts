import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './api/auth/auth.service';
import { AuthController } from './api/auth/auth.controller';
import { User } from './modules/user.entity';
import { UserService } from './user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './api/auth/constants';

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
  SequelizeModule.forFeature([User]),
  JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '60s' },
  }),

],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, UserService],
})
export class AppModule {}