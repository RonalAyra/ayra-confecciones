import {IsNotEmpty, IsOptional} from 'class-validator';
import {Type} from "class-transformer";
export class ProfessionalInfoDto {
  @IsNotEmpty()
  description: string;

  @IsOptional()
  sound_cloud_link: string;

  @IsOptional()
  spotify_link: string;

  @IsOptional()
  instagram_link: string;

  @IsOptional()
  sound_cloud_track_link: string;
}
