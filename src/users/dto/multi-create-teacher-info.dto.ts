import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { CreateTeachersInfoDto } from 'src/auth/dto/create-teacher-info.dto';

export class MultiCreateTeacherInfoDto {
    @ApiProperty({
        description: '여러 교사 정보 배열',
        type: [CreateTeachersInfoDto],
        isArray: true,
    })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => CreateTeachersInfoDto)
    teachers: CreateTeachersInfoDto[];
}