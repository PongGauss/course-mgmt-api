import { UserRole } from '.prisma/client';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { SigninDto, SignupDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';
import { Roles } from 'src/decorator/roles.decorator';
import { User, UserInfo } from '../decorators/user.decorator';
import { ProfileDto } from '../dtos/profile.dto';
// import { UserInterceptor } from '../interceptors/user.interceptor';

// @UseInterceptors(UserInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() req: SignupDto) {
    return this.authService.signup(req);
  }

  @Post('/signin')
  async signin(@Body() req: SigninDto) {
    return this.authService.signin(req);
  }

  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR)
  @Get('/me')
  async getMe(@User() user: UserInfo) {
    return this.authService.getProfile(user.uuid);
  }

  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR)
  @Patch('/me')
  async updateMe(@Body() req: ProfileDto, @User() user: UserInfo) {
    return this.authService.updateProfile(req, user.uuid);
  }
}
