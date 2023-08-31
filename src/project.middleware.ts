import { Injectable, NestMiddleware, Req } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ProjectMiddleware implements NestMiddleware {
  use(@Req() req, res: Response, next: NextFunction) {
    
    console.log('Project Middleware executed');

    next(); 
  }
}
