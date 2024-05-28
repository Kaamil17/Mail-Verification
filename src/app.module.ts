import envKeys from '../config/config-keys';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongooseModule.forRoot(envKeys.mongodb.dbURI), UserModule],
})
export class AppModule {}
