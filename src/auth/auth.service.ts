import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { AuthDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

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
    if (oldUser) throw new BadRequestException('Email занят');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: await hash(dto.password),
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

    if (!user) throw new NotFoundException('Пользователь не найден!');

    const isValidPassword = await verify(dto.password, user.password);
    if (!isValidPassword)
      throw new UnauthorizedException('Не правильный пароль!');

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
