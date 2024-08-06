import { IsString, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateExamDto } from './create-exam.dto';
import { UsersModel } from '../../users/entities/user.entity';

export class UpdateExamDto extends PartialType(CreateExamDto) {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => UsersModel)
    examiner?: UsersModel;

    @IsOptional()
    @IsDateString()
    createdAt?: Date;

    // problemIds 필드는 별도의 로직으로 처리해야 할 수 있습니다.
}