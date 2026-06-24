import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';

export class CreateMonitorDto {
  @ApiProperty({
    description: 'The name of the monitor you want to add',
    example: 'test monitor'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The url of the api monitor you want to add',
    example: 'test api url'
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'how often you want the monitor to ping the URL in seconds',
    example: 300
  })
  @IsNumber()
  @Min(10)
  interval: number;

  @ApiProperty({
    description: 'The StatusCode you expect to return',
    example: 200
  })
  @IsNumber()
  @IsOptional()
  expectedStatusCode?: number;

  @ApiProperty({
    description: 'The activation key',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateMonitorDto extends PartialType(CreateMonitorDto) { }