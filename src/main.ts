import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from 'src/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT, '0.0.0.0');

  console.log(`Application running on port ${process.env.PORT}`);
}
bootstrap();
