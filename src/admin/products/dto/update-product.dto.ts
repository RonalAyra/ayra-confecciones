import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class UpdateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
  
  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  in_offer: string;
  
  @IsOptional()
  discount: string;

  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  product_picture: string;
}
