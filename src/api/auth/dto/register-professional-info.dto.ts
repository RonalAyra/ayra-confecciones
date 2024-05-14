import { IsNotEmpty, IsOptional } from 'class-validator';
export class RegisterProfessionalInfoDto {
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

  @IsOptional()
  about_description: string;

  @IsOptional()
  about_photo: string;

  @IsOptional()
  labels: Array<string>;

  @IsOptional()
  artist_id: string;
}
