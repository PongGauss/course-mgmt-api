import { CACHE_MANAGER, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '../jwt/jwt.service';
import { mockCachedProfile } from '../mocks/user.mock';
import { AuthService } from './auth.service';
import { Cache } from 'cache-manager';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let cacheService: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockReturnValue([]),
            },
          },
        },
        JwtService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    cacheService = module.get(CACHE_MANAGER);
  });

  describe('getProfile', () => {
    it('should return from service when cached hit', async () => {
      const spy = jest
        .spyOn(cacheService, 'get')
        .mockImplementation(async () => mockCachedProfile);

      await service.getProfile('uuid');

      const spy2 = jest.spyOn(prismaService.user, 'findUnique');
      expect(spy).toBeCalledTimes(1);
      expect(spy2).toBeCalledTimes(0);
    });

    it('should get data from prisma service when cache miss', async () => {
      const spy = jest
        .spyOn(cacheService, 'get')
        .mockImplementation(async () => false);

      await service.getProfile('uuid');

      const spy2 = jest.spyOn(prismaService.user, 'findUnique');
      expect(spy).toBeCalledTimes(1);
      expect(spy2).toBeCalledTimes(1);
    });

    it('should throw from service when cache miss and prisma cannot find user', async () => {
      jest.spyOn(cacheService, 'get').mockImplementation(async () => false);
      jest.spyOn(prismaService.user, 'findUnique').mockReturnValue(null);

      expect(service.getProfile('uuid')).rejects.toThrowError(HttpException);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
