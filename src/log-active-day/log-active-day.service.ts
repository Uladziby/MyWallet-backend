import { Injectable } from '@nestjs/common';
import { LogActiveDayDto } from './log-active-day.dto';
import { PrismaService } from '../prisma.service';
import * as dayjs from 'dayjs';

require('json-bigint-patch');
const currentDay = dayjs().format('YYYY-MM-DD');

@Injectable()
export class LogActiveDayService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate({ sessionCount }: LogActiveDayDto, userId: number) {
    const whereBy = {
      userId: userId,
      createdAt: {
        gte: new Date(currentDay + 'T00:00:00'),
        lte: new Date(currentDay + 'T23:59:59'),
      },
    };

    const log = await this.prisma.logActiveDay.findFirst({
      where: whereBy,
    });

    if (!log) {
      return await this.prisma.logActiveDay.create({
        data: {
          userId,
          sessionCount,
        },
      });
    } else {
      return this.prisma.logActiveDay.updateMany({
        where: {
          AND: [
            { userId },
            {
              createdAt: {
                gte: new Date(currentDay + 'T00:00:00'),
              },
            },
            {
              createdAt: {
                lte: new Date(currentDay + 'T23:59:59'),
              },
            },
          ],
        },
        data: { sessionCount },
      });
    }
  }

  async getStatistics(userId) {
    return this.prisma
      .$queryRaw`SELECT TOCHAR(DATE_TRUNC("month", created_at) , 'Month')AS month, SUM(sessionCount) AS session_count FROM log_active_day WHERE user_id =${userId} GROUP BY month ORDER BY month DESC`;
  }
}
