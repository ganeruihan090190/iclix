import { IsString, MinLength, IsOptional, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
