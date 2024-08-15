// src/users/dto/teachers-info-pagination.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { TeachersInfo } from 'src/users/entities/teachers-info.entity';

export class TeachersInfoPaginationDto {
    @ApiProperty({ type: [TeachersInfo] })
    teachersInfoList: TeachersInfo[];

    @ApiProperty()
    totalPages: number;

    @ApiProperty()
    totalElements: number;

    @ApiProperty()
    perPage: number;

    @ApiProperty()
    first: boolean;

    @ApiProperty()
    last: boolean;

    @ApiProperty()
    empty: boolean;
}