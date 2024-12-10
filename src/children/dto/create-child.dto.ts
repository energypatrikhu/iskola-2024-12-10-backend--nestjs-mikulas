import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateChildDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsBoolean()
  wasGood: boolean;

  @IsOptional()
  @IsString()
  toy?: string;
}
