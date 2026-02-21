import { Module } from '@nestjs/common';
import { LogActiveDayService } from './log-active-day.service';
import { LogActiveDayController } from './log-active-day.controller';

@Module({
  controllers: [LogActiveDayController],
  providers: [LogActiveDayService]
})
export class LogActiveDayModule {}
