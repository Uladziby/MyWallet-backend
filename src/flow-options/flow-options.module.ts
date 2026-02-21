import { Module } from '@nestjs/common';
import { FlowOptionsService } from './flow-options.service';
import { FlowOptionsController } from './flow-options.controller';

@Module({
  controllers: [FlowOptionsController],
  providers: [FlowOptionsService]
})
export class FlowOptionsModule {}
