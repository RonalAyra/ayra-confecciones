import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthService } from './auth.service';
import { UserSchema } from '../../schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../admin/auth/constants';
@Module({
  imports: [
    NestjsFormDataModule,
    MongooseModule.forFeature([
      { name: 'Users', schema: UserSchema },
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '365d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
