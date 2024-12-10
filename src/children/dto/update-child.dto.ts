import { PartialType } from '@nestjs/mapped-types';
import { CreateChildDto } from './create-child.dto';
import { IsString, IsBoolean } from 'class-validator';

export class UpdateChildDto extends PartialType(CreateChildDto) {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsBoolean()
  wasGood: boolean;

  @IsString()
  toy: string;
}
