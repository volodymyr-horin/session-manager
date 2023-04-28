import { Module } from '@nestjs/common';
import { SessionManagerService } from '@modules/session-manager/session-manager.service';

@Module({
  providers: [SessionManagerService],
  exports: [SessionManagerService],
})
export class SessionManagerModule {}
