import { IsNotEmpty } from 'class-validator';
export class RegisterGoogleDto {
  @IsNotEmpty()
  google_token: string;
}
