import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Email address of the user attempting to log in', example: 'example@gmail.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'exampleHashedPass' })
  @IsString()
  @MinLength(6)
  password: string;
}
