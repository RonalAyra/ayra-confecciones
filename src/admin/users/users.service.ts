import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { getAggregateResults } from '../../utils/pagination-agregate';
import { User } from './../../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.userModel.findOne({
      email: createUserDto.email,
      user_role: createUserDto.user_role,
    });

    if (userExists)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'User already exists with this email',
        },
        HttpStatus.FORBIDDEN,
      );

    const user = new this.userModel(createUserDto);
    await user.save();
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    updateUserDto.user_role = updateUserDto.user_role || 'client';
    const userExists = await this.userModel.findOne({
      _id: { $ne: id },
      email: updateUserDto.email,
      user_role: updateUserDto.user_role,
    });

    if (userExists)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'User already exists with this email',
        },
        HttpStatus.FORBIDDEN,
      );

    const form = { ...updateUserDto };

    if (updateUserDto.password === '') delete form.password;

    await this.userModel.findOneAndUpdate({ _id: id }, form);
    const user = await this.userModel.findOne({ _id: id });

    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `User doesn't exists.`,
        },
        HttpStatus.FORBIDDEN,
      );

    return user;
  }

  async delete(id: string): Promise<any> {
    const findUser = await this.userModel.findOne({ _id: id }).exec();
    if (!findUser) throw new HttpException('USER_NOT_FOUND', 404);
    return await this.userModel.deleteOne({ _id: id });
  }

  async findAll(params): Promise<any> {
    let search =
      params.status && params.status.length && params.status !== 'all'
        ? { status: params.status }
        : {};

    search = { ...{ user_role: { $in: ['client'] } }, ...search };

    const sort =
      params.sortBy && params.sortBy.length
        ? { sortBy: params.sortBy, sortOrder: 'asc' }
        : {};

    const result = await getAggregateResults(
      this.userModel,
      [],
      params,
      sort,
      search,
    );

    // result.rows = plainToInstance(UserSerializer, result.rows, {
    //   excludeExtraneousValues: true,
    // });

    return result;
  }

  async findbyEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });

    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `User doesn't exists.`,
        },
        HttpStatus.FORBIDDEN,
      );

    return user;
  }
}
