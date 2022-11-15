import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PATH_METADATA } from '@nestjs/common/constants';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const path = this.reflector.get<string[]>(
      PATH_METADATA,
      context.getHandler(),
    );

    const token = request?.headers?.authorization?.split('Bearer ')[1];
    if (token === undefined) {
      return handler.handle();
    }
    const user = await jwt.decode(token);

    const profile = await this.authService.getProfile(user.uuid);
    request.user = profile;
    return handler.handle();
  }
}
