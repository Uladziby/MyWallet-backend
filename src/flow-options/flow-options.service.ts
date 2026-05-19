import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { FlowOptionDto } from 'src/flow-options/flow-options.dto';

@Injectable()
export class FlowOptionsService {
  constructor(private prisma: PrismaService) {}

  async update(
    { sessionCount, breakDuration, flowDuration }: FlowOptionDto,
    userId: number,
  ) {
    return this.prisma.flowOptions.update({
      where: {
        userId,
      },
      data: {
        sessionCount,
        breakDuration,
        flowDuration,
      },
    });
  }

  async get(userId) {
    return this.prisma.flowOptions.findUnique({
      where: {
        userId,
      },
    });
  }
}
