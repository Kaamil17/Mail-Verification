import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../interfaces/user.interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST  method for the  /user/register url
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  // GET method
  @Get('verify-email/:username/:verificationToken')
  async verifyEmail(
    @Param('username') username: string,
    @Param('verificationToken') verificationToken: string,
  ): Promise<{ message: string }> {
    await this.userService.verifyEmail(username, verificationToken);
    return { message: 'Email verified successfully' };
  }

  // GET method
  @Get('check-verification/:username')
  async checkVerification(
    @Param('username') username: string,
  ): Promise<{ message: string }> {
    const verificationStatus =
      await this.userService.checkVerification(username);
    return { message: verificationStatus };
  }
}
