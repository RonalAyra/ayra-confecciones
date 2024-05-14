import { IsNotEmpty, IsEmail, IsOptional, IsString } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  phone_number: string;

  @IsString()
  @IsOptional()
  profile_picture: string;

  @IsOptional()
  google_id: string;

  @IsOptional()
  google_token: string;

  @IsOptional()
  fb_id: string;

  @IsOptional()
  fb_token: string;

  @IsOptional()
  device_token: string;

  @IsOptional()
  apple_id: string;

  @IsOptional()
  status: string;

  @IsOptional()
  user_role: string;
}
