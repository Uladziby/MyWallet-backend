import { Module } from '@nestjs/common';
import { LogActiveDayService } from './log-active-day.service';
import { LogActiveDayController } from './log-active-day.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LogActiveDayController],
  providers: [LogActiveDayService, PrismaService],
})
export class LogActiveDayModule {}
