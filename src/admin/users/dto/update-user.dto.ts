import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
export class UpdateUserDto {
  @IsNotEmpty()
  first_name: string;

  @IsOptional()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  phone_number: string;

  @IsOptional()
  profile_picture: string;

  @IsOptional()
  device_token: string;

  @IsOptional()
  status: string;

  @IsOptional()
  user_role: string;
}
