import { Expose } from 'class-transformer';

export class CourseInstructorUser {
  @Expose({ name: 'firstName' })
  first_name: string;

  @Expose({ name: 'lastName' })
  last_name: string;

  constructor(partial: Partial<CourseInstructorUser>) {
    Object.assign(this, partial);
  }
}

export class CourseResponseDto {
  name: string;
  slug: string;
  subject: string;

  @Expose({ name: 'startedAt' })
  started_at: Date;

  @Expose({ name: 'endedAt' })
  ended_at: Date;

  @Expose({ name: 'openedSeat' })
  opened_seat: number;

  description: string;
  category: string;
  image: string;

  user: CourseInstructorUser;

  constructor(
    partial: Partial<CourseResponseDto>,
    courseInstructorUser: CourseInstructorUser,
  ) {
    Object.assign(this, partial);
    this.user = courseInstructorUser;
  }
}
