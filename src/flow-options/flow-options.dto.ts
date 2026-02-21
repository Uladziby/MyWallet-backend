import { IsNumber } from 'class-validator';

export class FlowOptionDto {
  @IsNumber()
  flowDuration: number;

  @IsNumber()
  breakDuration: number;

  @IsNumber()
  sessionCount: number;
}
