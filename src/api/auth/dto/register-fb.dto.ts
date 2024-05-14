import { IsNotEmpty } from 'class-validator';
export class RegisterFbDto {
  @IsNotEmpty()
  fb_token: string;
}
