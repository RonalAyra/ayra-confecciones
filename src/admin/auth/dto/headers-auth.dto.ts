import { IsNotEmpty } from 'class-validator';

export class HeadersAuthDto {
  @IsNotEmpty()
  authorization: string;

  @IsNotEmpty()
  'content-type': string;
}
