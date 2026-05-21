import { Controller, Get } from '@nestjs/common';
import { LogActiveDayService } from './log-active-day.service';
import { Auth } from '../auth/auth.decorator';
import { CurrentUser } from '../auth/user.decorator';

@Controller('log-active-day')
export class LogActiveDayController {
  constructor(private readonly logActiveDayService: LogActiveDayService) {}

  @Get('statistics')
  @Auth()
  async getStatistics(@CurrentUser('id') userId: number) {
    return this.logActiveDayService.getStatistics(userId);
  }
}
