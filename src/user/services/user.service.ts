import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../interfaces/user.interfaces';
import { CreateUserDto } from '../dto/create-user.dto';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import envKeys from '../config/env-keys';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  // create the user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const verificationToken = this.createVerificationToken();
    const createdUser = new this.userModel({
      ...createUserDto,
      verificationToken,
      isVerified: false,
    });
    await this.sendVerificationEmail(createUserDto.email, verificationToken);
    return createdUser.save();
  }

  // token generator using the crypto lib
  private createVerificationToken(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  // sending the token the to email
  private async sendVerificationEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        // write the email and password in the env-keys.ts  (api-task\src\user\config\env-keys.ts)
        user: envKeys.email.emailAddress,
        pass: envKeys.email.password,
      },
    });

    const mailOptions = {
      // Please write your own email here.
      from: envKeys.email.emailAddress,
      to: email,
      subject: 'Email Verification',
      text: `Your verification token is ${token}`,
    };

    await transporter.sendMail(mailOptions);
  }

  // this funcitons below takes care of the email verification and checking the tokens and
  // the username
  async verifyEmail(
    username: string,
    verificationToken: string,
  ): Promise<void> {
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.verificationToken !== verificationToken) {
      throw new BadRequestException('Invalid verification token');
    }

    user.isVerified = true;
    await user.save();
  }

  // check if the user is verified or not
  async checkVerification(username: string): Promise<string> {
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.isVerified ? 'user is verified' : 'user is not verified';
  }
}
