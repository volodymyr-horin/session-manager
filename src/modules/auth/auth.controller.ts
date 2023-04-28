import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@modules/auth/auth.service';
import { AccessTokenDto } from '@modules/auth/dto/access-token.dto';
import { LocalAuthGuard } from '@modules/auth/guards/local-auth.guard';
import { LoginDto } from '@modules/auth/dto/login.dto';

@ApiTags('auth')
@Controller('/v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'Access and Refresh token',
    type: AccessTokenDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() request: LoginDto,
    @Request() req,
  ): Promise<AccessTokenDto> {
    return this.authService.login(req.user, request.deviceId);
  }
}
