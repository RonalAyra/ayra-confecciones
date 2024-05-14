import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
export class RegisterDto {
  @IsNotEmpty()
  first_name: string;

  @IsOptional()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  phone_number: string;

  @IsOptional()
  profile_picture: string;

  @IsOptional()
  user_role: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  role?: string;
}
