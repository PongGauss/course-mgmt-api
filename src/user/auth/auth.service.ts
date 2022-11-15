import {
  Injectable,
  ConflictException,
  HttpException,
  NotFoundException,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
// import * as jwt from 'jsonwebtoken';
import { Gender, UserRole } from '@prisma/client';
import { SigninDto, SignupDto } from '../dtos/auth.dto';
import { UserProfileResponseDto } from '../dtos/response.dto';
import { last } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '../jwt/jwt.service';
import { ProfileDto } from '../dtos/profile.dto';

interface UpdateProfileParams {
  first_name?: string;
  last_name?: string;
  nick_name?: string;
  gender?: Gender;
  birth_day?: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signup({
    email,
    password,
    firstName,
    lastName,
    nickName,
    birthDate,
    gender,
    role,
  }: SignupDto) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uuid = uuidv4();

    const userRole: UserRole = UserRole[role];
    const userGender: Gender = Gender[gender];

    const user = await this.prismaService.user.create({
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        nick_name: nickName,
        password: hashedPassword,
        user_role: userRole,
        birth_day: birthDate,
        gender: userGender,
        uuid,
        deleted_at: new Date(),
      },
    });

    return {
      token: this.jwtService.generateJWT(
        user.first_name,
        user.last_name,
        user.uuid,
      ),
    };
  }

  async signin({ email, password }: SigninDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    const hashedPassword = user.password;

    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException('Invalid credentials', 400);
    }

    return {
      token: this.jwtService.generateJWT(
        user.first_name,
        user.last_name,
        user.uuid,
      ),
    };
  }

  async getProfile(uuid: string) {
    // TODO: Check Cache hit if not then get the data from main storage
    const cachedUser = await this.cacheManager.get(uuid);
    if (cachedUser) {
      return new UserProfileResponseDto(cachedUser);
    } else {
      // get data from db
      const user = await this.prismaService.user.findUnique({
        where: {
          uuid,
        },
      });

      if (!user) {
        throw new HttpException('Invalid credentials', 400);
      }

      await this.cacheManager.set(uuid, user);

      return new UserProfileResponseDto(user);
    }
  }

  async updateProfile(profile: ProfileDto, uuid: string) {
    // check if user is exist
    const userExist = await this.prismaService.user.findUnique({
      where: {
        uuid,
      },
    });

    if (!userExist) {
      throw new NotFoundException();
    }

    const updateParam: UpdateProfileParams = {};
    updateParam.first_name = profile.firstName;
    updateParam.last_name = profile.lastName;
    updateParam.nick_name = profile.nickName;
    updateParam.gender = Gender[profile.gender];
    updateParam.birth_day = profile.birthDate;

    const updatedUser = await this.prismaService.user.update({
      where: {
        uuid,
      },
      data: updateParam,
    });

    return new UserProfileResponseDto(updatedUser);
  }
}
