import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProfessionalInfoDto } from './professional-info.dto';
export class RegisterArtistDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  country_id: string;

  @IsOptional()
  about_description: string;

  @IsOptional()
  about_photo: string;

  @IsOptional()
  profile_picture: string;

  @IsOptional()
  cover_picture: string;

  @IsOptional()
  labels: Array<string>;

  @Type(() => ProfessionalInfoDto)
  @ValidateNested()
  professional_info: string;

  @IsOptional()
  is_verified: boolean;
}
