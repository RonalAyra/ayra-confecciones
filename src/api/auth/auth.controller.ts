import {
  Body,
  Controller,
  HttpException,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import MongooseClassSerializerInterceptor from '../../interceptors/mongooseClassSerializer.interceptor';
import { UserSerializer } from '../../serializers/user.serializer';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import {
  FileInterceptor,
} from '@nestjs/platform-express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('profile_picture'))
  @UseInterceptors(MongooseClassSerializerInterceptor(UserSerializer))
  async addUser(
    @Body() registerDto: RegisterDto,
  ) {
    registerDto.status = 'active';
    if (registerDto.role) {
      registerDto.user_role = registerDto.role;
    }
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @UseInterceptors(MongooseClassSerializerInterceptor(UserSerializer))
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('logout')
  async logout(@Body() logoutDto: LogoutDto) {
    try {
      const deviceToken = await this.authService.logout(logoutDto);
      if (deviceToken)
        return { statusCode: 200, message: 'user logged out successfully' };
      else throw new HttpException("the specified user doesn't exist", 404);
    } catch (e) {
      throw new HttpException("the specified user doesn't exist", 404);
    }
  }
}
