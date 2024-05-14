import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';
export class RegisterAppleDto {
  @IsNotEmpty()
  @IsString()
  apple_id: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsOptional()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email_name: string;
}
