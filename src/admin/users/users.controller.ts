import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import MongooseClassSerializerInterceptor from '../../interceptors/mongooseClassSerializer.interceptor';
import { UserSerializer } from '../../serializers/user.serializer';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @UseInterceptors(MongooseClassSerializerInterceptor(UserSerializer))
  @Get('detail/:id')
  async userDetail(@Param() params) {
    return await this.usersService.findById(params.id);
  }

  @UseInterceptors(MongooseClassSerializerInterceptor(UserSerializer))
  @Get('list')
  async findAll(@Query() params) {
    return await this.usersService.findAll(params);
  }

  @UseInterceptors(MongooseClassSerializerInterceptor(UserSerializer))
  @UseInterceptors(FileInterceptor('profile_picture'))
  @Post('create')
  
  async addUser(
    @Body() userDto: CreateUserDto,
    @UploadedFile() profilePicture: any, // Asegúrate de que estás utilizando el tipo correcto aquí
  ) {
    if (profilePicture) {
      userDto.profile_picture = profilePicture.filename;
    }
    return await this.usersService.create(userDto);
  }

  @UseInterceptors(MongooseClassSerializerInterceptor(UserSerializer))
  @UseInterceptors(FileInterceptor('profile_picture'))
  @Put('update/:id')
  async updateUser(
    @Param() params,
    @Body() userDto: UpdateUserDto,
    @UploadedFile() profilePicture: any, // Asegúrate de que estás utilizando el tipo correcto aquí
  ) {

    if (profilePicture) {
      userDto.profile_picture = profilePicture.filename;
    }
    return await this.usersService.update(params.id, userDto);
  }

  @Delete('delete/:id')
  async deleteUser(@Param() params) {
    try {
      await this.usersService.delete(params.id);
      return { statusCode: 200, message: 'User deleted successfully' };
    } catch (e) {
      throw new HttpException('CLIENT_NOT_FOUND', 404);
    }
  }
}
