import { Controller, Get, UseGuards, Post, Request, Body, UseFilters, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { ApiOperation, ApiCreatedResponse, ApiBody, ApiBearerAuth, ApiProperty, ApiOkResponse } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { AuthService } from './auth/auth.service';
import { APIHttpExceptionFilter } from './http-exception.filter';
import { UserService } from './user/user.service';
import { UserOwnInfoDto } from './user/user.dto';


/**
 * Describe login to swagger
 */
export class LoginDetails {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  readonly password: string;
}

/**
 * Describe login to swagger
 */
export class UserDetails {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  readonly displayName: string;

  @ApiProperty()
  readonly publicId: string;
}

/**
 * Login reply.
 */
export class AuthInfo {
  @ApiProperty({ description: 'JWT token' })
  readonly accessToken: string;

  @ApiProperty({ description: 'Logged in user info' })
  readonly userDetails: UserDetails;
}


@Controller()
@UseFilters(new APIHttpExceptionFilter())  // Nice error handling
export class AppController {

  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UserService) {
  }

  @Get()
  getHello(): string {
    return 'Fullstack hiring exercise backend';
  }

  @ApiOperation({ summary: "Log in a user and return session JWT token" })
  @ApiOkResponse({ description: 'Received session token',})
  @Post('login')
  async login(@Body() data: LoginDetails): Promise<AuthInfo> {
    return this.authService.login(data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Called on app reload to get the information of currenty logged in user" })
  @Get('userInfo')
  async getUserInfo(@Request() req): Promise<UserOwnInfoDto> {
    Logger.log(`Getting profiel for ${req.user.userId}`);
    const profile = await this.userService.getProfileById(req.user.userId);
    return profile;
  }

}
