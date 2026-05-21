import { PrismaService } from './../prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { AuthDto } from './auth.dto';
import { Logger } from '@nestjs/common';
import type { User } from '../../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);

    return {
      user: this.returnUserFields(user),
      accessToken: await this.issueAccessToken(user.id),
    };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (oldUser) throw new BadRequestException('Email is already used');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: await hash(dto.password),
        options: {
          create: {
            sessionCount: 7,
            breakDuration: 30,
            flowDuration: 50,
          },
        },
      },
    });

    return {
      user: this.returnUserFields(user),
      accessToken: await this.issueAccessToken(user.id),
    };
  }

  async validateUser(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new NotFoundException('User not found!');

    const isValidPassword = await verify(user.password, dto.password);
    if (!isValidPassword) throw new UnauthorizedException('Invalid password!');

    return user;
  }

  async issueAccessToken(userId: number) {
    const data = {
      id: userId,
    };

    return await this.jwtService.signAsync(data, {
      expiresIn: '31d',
    });
  }

  returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
