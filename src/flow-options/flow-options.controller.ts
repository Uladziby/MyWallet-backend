import { FlowOptionDto } from './flow-options.dto';
import { CurrentUser } from './../auth/user.decorator';
import { Auth } from './../auth/auth.decorator';
import { Controller, Get, HttpCode, Put, UsePipes, Body, ValidationPipe } from '@nestjs/common';
import { FlowOptionsService } from './flow-options.service';

@Controller('flow-options')
export class FlowOptionsController {
  constructor(private readonly flowOptionsService: FlowOptionsService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put()
  async createOrUpdate(
    @CurrentUser('id') userId: number,
    @Body() flowOptionDto: FlowOptionDto,
  ) {

    return this.flowOptionsService.update(flowOptionDto, userId); 
  }

  @Get()
  @Auth()
  async get(@CurrentUser('id') userId: number) {
    return this.flowOptionsService.get(userId);
  }
}
