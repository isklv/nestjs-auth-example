import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEnum } from 'class-validator';
import { ScopeDto } from './scopes.dto';

export class CreateUserDto {
  @IsAlpha()
  @ApiProperty({ example: 'Company' })
  username: string;

  @IsEnum(ScopeDto, { each: true })
  @ApiProperty({ type: [String], enum: ScopeDto })
  scope: string[];

  token?: string;

  id?: string;
}
