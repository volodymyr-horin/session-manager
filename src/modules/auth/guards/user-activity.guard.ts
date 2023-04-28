import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import {
  ExecutionContext,
  Inject,
  Logger,
  HttpException,
} from '@nestjs/common';
import { SessionStatus } from '@modules/session-manager/types';
import { ConfigService } from '@nestjs/config';
import { SessionManagerService } from '@modules/session-manager/session-manager.service';

export class UserActivityGuard extends JwtAuthGuard {
  private readonly logger = new Logger(UserActivityGuard.name);
  private sessionActivityTtl;
  private sessionBlockTtl;

  constructor(
    @Inject(SessionManagerService)
    private readonly sessionManagerService: SessionManagerService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.sessionActivityTtl = configService.get('app.sessionActivityTtl');
    this.sessionBlockTtl = configService.get('app.sessionBlockTtl');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest();

    const session = await this.sessionManagerService.getUserSession(
      request.user.id,
    );

    if (!session) {
      await this.sessionManagerService.createSession(request.user.id);
      return true;
    }

    const now = Date.now();

    if (session.lastActivityTs + this.sessionActivityTtl <= now) {
      await this.sessionManagerService.refreshSessionActivity(session);
      return true;
    }

    if (session.firstActivityTs + this.sessionBlockTtl <= now) {
      this.logger.debug(`User ${session.userId} blocked due to activity limit`);
      await this.sessionManagerService.blockSession(session);
      throw new HttpException('Too many requests', 429);
    }

    if (session.status === SessionStatus.Blocked) {
      throw new HttpException('Too many requests', 429);
    }

    await this.sessionManagerService.updateSessionActivity(session);
    return true;
  }
}
