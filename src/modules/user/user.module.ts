import { Module } from '@nestjs/common';
import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';
import { SessionManagerModule } from '@modules/session-manager/session-manager.module';

@Module({
  imports: [SessionManagerModule, TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
