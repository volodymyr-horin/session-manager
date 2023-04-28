import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { SessionPayload, SessionStatus } from '@modules/session-manager/types';

@Injectable()
export class SessionManagerService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async getUserSession(userId: string) {
    return this.getSession(this.getSessionKey(userId));
  }

  async createSession(userId: string): Promise<SessionPayload> {
    const key = this.getSessionKey(userId);
    const now = Date.now();
    const session: SessionPayload = {
      userId,
      createdTs: now,
      lastActivityTs: now,
      firstActivityTs: now,
      status: SessionStatus.Active,
    };
    return this.setSession(key, session);
  }

  async updateSessionActivity(
    session: SessionPayload,
  ): Promise<SessionPayload> {
    const key = this.getSessionKey(session.userId);
    const now = Date.now();
    return this.setSession(key, {
      ...session,
      lastActivityTs: now,
    });
  }

  async blockSession(session: SessionPayload): Promise<void> {
    const key = this.getSessionKey(session.userId);
    await this.setSession(key, {
      ...session,
      status: SessionStatus.Blocked,
    });
  }

  async refreshSessionActivity(session: SessionPayload): Promise<void> {
    const key = this.getSessionKey(session.userId);
    const now = Date.now();
    await this.setSession(key, {
      ...session,
      firstActivityTs: now,
      lastActivityTs: now,
      status: SessionStatus.Active,
    });
  }

  private async getSession(key: string): Promise<SessionPayload | null> {
    const session = await this.redis.get(key);

    if (session) {
      try {
        return JSON.parse(session);
      } catch (err) {
        return null;
      }
    }

    return null;
  }

  private async setSession(
    key: string,
    session: SessionPayload,
  ): Promise<SessionPayload> {
    await this.redis.set(key, JSON.stringify(session));
    return session;
  }

  private getSessionKey(userId: string): string {
    return `session:${userId}`;
  }
}
