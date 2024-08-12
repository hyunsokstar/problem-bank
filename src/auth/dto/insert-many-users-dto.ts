import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class InsertManyUsersDto {
    @ApiProperty({
        description: '생성할 사용자의 이메일 도메인',
        example: 'example.com',
        required: false,
    })
    @IsString()
    @IsOptional()
    emailDomain?: string;

    @ApiProperty({
        description: '생성할 사용자의 이름 접두사',
        example: 'TestUser',
        required: false,
    })
    @IsString()
    @IsOptional()
    namePrefix?: string;
}