import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './../../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LogoutDto } from './dto/logout.dto';
import { RegisterDeviceTokenDto } from './dto/register-device-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterGoogleDto } from './dto/register-google.dto';
import { RegisterFbDto } from './dto/register-fb.dto';
import { RegisterAppleDto } from './dto/register-apple.dto';
import { RegisterArtistDto } from './dto/register-artist.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: RegisterDto) {
    const existUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();

    if (existUser) throw new HttpException('EMAIL_REGISTERED', 403);

    if (!createUserDto.role) createUserDto['user_role'] = 'client';
    if (createUserDto.user_role === 'client')
      createUserDto['status'] = 'active';

    const user = new this.userModel(createUserDto);
    await user.save();

    const payload = {
      user_id: user._id,
      user_first_name: user.first_name,
    };

    return user;
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const findUser = await this.userModel
      .findOne({
        email: email,
        $or: [{ user_role: { $ne: 'admin' }, status: 'active' }],
      })
      .exec();
    if (!findUser) throw new HttpException('USER_NOT_FOUND', 404);

    const checkpassword = await compare(password, findUser.password);

    if (!checkpassword) throw new HttpException('PASSWORD_INCORRECT', 403);

    return findUser;
  }

  

  async logout(logoutDto: LogoutDto): Promise<boolean> {
    const { access_token, device_token } = logoutDto;
    const validate = this.jwtService.verify(access_token);
    if (!device_token && validate.user_id) return true;
    else return false;
  }
}
