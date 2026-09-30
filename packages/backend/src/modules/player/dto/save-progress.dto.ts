import { IsString, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';

export class SaveProgressDto {
  @IsString()
  profileId!: string;

  @IsInt()
  @Min(0)
  seconds!: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
