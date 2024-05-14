import { IsNotEmpty, IsOptional } from 'class-validator';

export class LogoutDto {
  @IsNotEmpty()
  access_token: string;

  @IsOptional()
  device_token: string;
}
