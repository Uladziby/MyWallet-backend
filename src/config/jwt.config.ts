import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtSecret = (configService: ConfigService): string =>
  configService.get<string>('JWT_SECRET') ||
  configService.get<string>('SECRET_KEY') ||
  'change-this-jwt-secret';

export const getJwtConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => ({
  secret: getJwtSecret(configService),
});
