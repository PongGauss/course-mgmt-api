import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseCreateDto } from './dtos/course.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { User, UserInfo } from 'src/user/decorators/user.decorator';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Roles(UserRole.INSTRUCTOR)
  @Post('')
  async createCourse(@Body() req: CourseCreateDto, @User() user: UserInfo) {
    return this.courseService.create(req, user);
  }

  @Get(':slug')
  async getCourse(@Param('slug') slug: string, @User() user: UserInfo) {
    return this.courseService.getCourse(slug, user);
  }

  @Get('')
  async searchCourse(@Query('q') q: string, @Query('date') date: string) {
    const filters = {
      ...(q && {
        slug: {
          contains: q,
        },
      }),
      ...(date && {
        ended_at: {
          gte: new Date(date),
        },
        started_at: {
          lte: new Date(date),
        },
      }),
    };
    // return filters;
    return this.courseService.searchCourse(filters);
  }
}
