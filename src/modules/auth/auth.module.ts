import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@modules/user/user.module';
import { AuthService } from '@modules/auth/auth.service';
import { AuthController } from '@modules/auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from '@modules/auth/strategies/local.strategy';
import { JwtStrategy } from '@modules/auth/strategies/jwt.strategy';
import { SessionManagerModule } from '@modules/session-manager/session-manager.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    SessionManagerModule,
    {
      ...JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return {
            secret: configService.get('jwt.secret'),
            signOptions: {
              expiresIn: configService.get('jwt.expiresIn'),
            },
          };
        },
      }),
      global: true,
    },
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
