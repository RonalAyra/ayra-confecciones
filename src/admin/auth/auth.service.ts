import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { plainToClass } from 'class-transformer';
import { UserSerializer } from '../../serializers/user.serializer';
import { HeadersAuthDto } from './dto/headers-auth.dto';
import { PayloadAuth } from './dto/payload-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(userObjectLogin: LoginAuthDto) {
    const { email, password } = userObjectLogin;
    const findUser = await this.userModel.findOne({
      email: email,
      $or: [{ user_role: 'admin' }],
      $and: [{ status: 'active' }],
    });
    if (!findUser) throw new HttpException('USER_NOT_FOUND', 404);

    const findUserSerializer = plainToClass(UserSerializer, findUser, {
      excludeExtraneousValues: true,
    });

    const checkpassword = await compare(password, findUser.password);

    if (!checkpassword) throw new HttpException('PASSWORD_INCORRECT', 403);

    const payload = {
      user_id: findUser._id,
      user_first_name: findUser.first_name,
    };

    const data = {
      ...findUserSerializer,
      access_token: this.jwtService.sign(payload),
    };

    return data;
  }

  async getUser(headers: HeadersAuthDto) {
    const token = headers.authorization.split(' ')[1];
    const user = this.jwtService.decode(token) as PayloadAuth;
    const findUser = await this.userModel.findOne({ _id: user.user_id });

    const findUserSerializer = plainToClass(UserSerializer, findUser, {
      excludeExtraneousValues: true,
    });

    const data = {
      ...findUserSerializer,
      access_token: token,
    };

    return data;
  }
}
