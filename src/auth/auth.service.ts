import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  Session,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { RegisterDto } from './Dtos/register.dto';
import { LoginDto } from './Dtos/Login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { timingSafeEqual } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService /*, private jwtService: JwtService*/,
  ) {}

  async signup(registerDto: RegisterDto) {
    const user = await this.usersService.findByEmail(registerDto.email);

    if (user) {
      throw new BadRequestException('Email already in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(registerDto.password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const newUser = await this.usersService.create({
      ...registerDto,
      password: result,
    });

    return newUser;
  }

  async signin(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    console.log(user.email, user.password);
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Account is deactivated. Please contact support.',
      );
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(loginDto.password, salt, 32)) as Buffer;

    if (!timingSafeEqual(Buffer.from(storedHash, 'hex'), hash)) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }

  async signout(session: any) {
    return new Promise((resolve, reject) => {
      session.destroy((err: any) => {
        if (err) {
          reject(new BadRequestException('Could not log out'));
        } else {
          resolve({ message: 'Logged out successfully' });
        }
      });
    });
  }
}
