import {
  Injectable,
  ConflictException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { CourseCategory, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInfo } from 'src/user/decorators/user.decorator';
import { CourseFilterParamDto } from './dtos/course-search.dto';
import { CourseCreateDto } from './dtos/course.dto';
import { CourseInstructorUser, CourseResponseDto } from './dtos/response.dto';

export const courseSelectedFields = {
  name: true,
  slug: true,
  subject: true,
  started_at: true,
  ended_at: true,
  opened_seat: true,
  description: true,
  category: true,
};

@Injectable()
export class CourseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    {
      name,
      image,
      subject,
      started_at,
      ended_at,
      opened_seat,
      description,
      category,
    }: CourseCreateDto,
    { id: userId }: UserInfo,
  ) {
    const courseCate: CourseCategory = CourseCategory[category];
    const slug = name.toLowerCase().replace(/ /g, '-');

    // slug must not duplicate
    const courseExists = await this.prismaService.course.findUnique({
      where: {
        slug,
      },
    });

    if (courseExists) {
      throw new ConflictException();
    }

    const course = await this.prismaService.course.create({
      data: {
        name,
        image,
        subject,
        started_at,
        ended_at,
        opened_seat,
        description,
        category: courseCate,
        deleted_at: new Date(),
        instructor_id: userId,
        slug,
      },
    });

    return { course };
  }

  async getCourse(slug: string, { id: userId }: UserInfo) {
    const courseExists = await this.prismaService.course.findFirst({
      where: {
        slug,
        instructor_id: userId,
      },
      select: {
        ...courseSelectedFields,
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    if (!courseExists) {
      throw new ConflictException();
    }

    return new CourseResponseDto(
      courseExists,
      new CourseInstructorUser(courseExists.user),
    );
  }

  async searchCourse(filters: CourseFilterParamDto) {
    const courseExists = await this.prismaService.course.findMany({
      select: {
        ...courseSelectedFields,
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      where: filters,
    });

    // this.prismaService.$on<any>('query', (event: Prisma.QueryEvent) => {
    //   console.log('Query: ' + event.query);
    //   console.log('Duration: ' + event.duration + 'ms');
    // });

    if (!courseExists) {
      throw new NotFoundException();
    }

    return courseExists.map((course) => {
      return new CourseResponseDto(
        course,
        new CourseInstructorUser(course.user),
      );
    });
  }
}
