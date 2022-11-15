import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  generateJWT(firstName: string, lastName: string, uuid: string) {
    return jwt.sign(
      {
        firstName,
        lastName,
        uuid,
      },
      process.env.JSON_TOKEN_KEY,
      {
        expiresIn: 3600000,
      },
    );
  }
}
