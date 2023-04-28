import {
  Controller,
  Request,
  Logger,
  Get,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserProfileDto } from '@modules/user/dto/user-profile.dto';
import { UserService } from '@modules/user/user.service';
import { SignUpDto } from '@modules/user/dto/sign-up.dto';
import { UserActivityGuard } from '@modules/auth/guards/user-activity.guard';

@ApiTags('User')
@Controller('/v1/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 200,
    description: 'User Profile',
    type: UserProfileDto,
  })
  @Post('sign-up')
  async signUp(@Body() body: SignUpDto): Promise<UserProfileDto> {
    return this.userService.signUp(body);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User Profile',
    type: UserProfileDto,
  })
  @UseGuards(UserActivityGuard)
  @Get('me')
  async getMe(@Request() req): Promise<UserProfileDto> {
    return this.userService.getProfile(req.user);
  }
}
