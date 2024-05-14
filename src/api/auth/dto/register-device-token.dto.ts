import { IsNotEmpty } from 'class-validator';

export class RegisterDeviceTokenDto {
  @IsNotEmpty()
  access_token: string;

  @IsNotEmpty()
  device_token: string;

  @IsNotEmpty()
  device_type: string;
}
