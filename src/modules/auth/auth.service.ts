import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@modules/user/entities/user.entity';
import { AccessTokenDto } from '@modules/auth/dto/access-token.dto';
import { JWTPayload } from '@modules/auth/types';
import { UserService } from '@modules/user/user.service';
import { SessionManagerService } from '@modules/session-manager/session-manager.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sessionManagerService: SessionManagerService,
  ) {}

  public async validateCredentials(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return null;
    }

    return user;
  }

  public async login(user: User, deviceId: string): Promise<AccessTokenDto> {
    const accessToken = this.generateAccessToken(user, deviceId);
    const session = await this.sessionManagerService.getUserSession(user.id);

    if (!session) {
      await this.sessionManagerService.createSession(user.id);
    }

    return {
      accessToken,
    };
  }

  private generateAccessToken(user: User, deviceId: string): string {
    return this.jwtService.sign({
      email: user.email,
      sub: user.id,
      deviceId,
    } as JWTPayload);
  }
}
