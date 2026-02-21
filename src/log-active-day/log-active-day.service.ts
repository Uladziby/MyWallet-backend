import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { AuthDto } from 'src/auth/auth.dto';
import { LogActiveDayDto } from 'src/log-active-day/log-active-day.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class LogActiveDayService {
  constructor(private prisma: PrismaService) {}
  async createOrUpdate({ sessionCount }: LogActiveDayDto, userId: number) {
    const currentDay = dayjs().format('YYYY-MM-DD');

    const where = {
      userId: userId,
      createdAt: {
        gte: new Date(currentDay + 'T00:00:00'),
        lte: new Date(currentDay + 'T23:59:59'),
      },
    };

    let log = await this.prisma.logActiveDay.findFirst({
      where,
    });

    if (!log) {
      log = await this.prisma.logActiveDay.create({
        data: {
          userId,
          sessionCount,
        },
      });
    } else {
      log = await this.prisma.logActiveDay.update({
        where,
        data: { sessionCount },
      });
    }

    return log;
  }

  async getStatistics(userId) {
    const log = await this.prisma.logActiveDay.groupBy({
      by: ['createdAt'],
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        userId,
      },
    });
    return log;
  }
}
