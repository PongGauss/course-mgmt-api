import {
  Module,
  ClassSerializerInterceptor,
  Scope,
  CacheModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { UserInterceptor } from './user/interceptors/user.interceptor';
import { CourseModule } from './course/course.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AuthService } from './user/auth/auth.service';
import { JwtService } from './user/jwt/jwt.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    CourseModule,
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      ttl: 120,
    }),
  ],
  controllers: [AppController],
  providers: [
    AuthService,
    JwtService,
    AppService,
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: UserInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
