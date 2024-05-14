import { IsNotEmpty } from 'class-validator';

export class PayloadAuth {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  user_first_name: string;

  @IsNotEmpty()
  iat: number;

  @IsNotEmpty()
  exp: number;
}
