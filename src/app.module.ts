import { ValidationOptions } from 'joi';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigValidationSchema } from '@config/validation/config-validation.shema';
import configuration from '@src/config/app.config';
import { SessionManagerModule } from '@modules/session-manager/session-manager.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      validationSchema: ConfigValidationSchema,
      validationOptions: {
        presence: 'required', // all fields are required by default
        abortEarly: false,
      } as ValidationOptions,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('postgres'),
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          config: {
            url: configService.get('redis.url'),
          },
          closeClient: false,
        };
      },
      inject: [ConfigService],
    }),
    SessionManagerModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
