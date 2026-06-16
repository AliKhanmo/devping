import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
    @ApiProperty({ description: 'Email address of the user attempting to log in', example: 'example@gmail.com' })
    email: string;

    @ApiProperty({ description: 'id of the user', example: '6a31a1ebc99aa53ca17bacdc' })
    id: string;
}
