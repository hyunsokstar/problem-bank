import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItemAdminDto {

    @ApiProperty({
        description: '아이템의 이름',
        example: '정승재'
    })
    name: string;

    @ApiProperty({
        description: '아이템의 폴더 경로',
        example: '/정승재'
    })
    folderPath: string;

    @ApiPropertyOptional({
        description: '아이템의 폴더 색상 (선택 사항)',
        example: '#FF5733'
    })
    folderColor?: string;

    @ApiPropertyOptional({
        description: '아이템의 순서 (선택 사항)',
        example: 1
    })
    order?: number;

    @ApiPropertyOptional({
        description: '아이템의 깊이 (선택 사항)',
        example: 0
    })
    depth?: number;

    @ApiPropertyOptional({
        description: '자식 아이템들 (선택 사항)',
        type: [CreateItemAdminDto]
    })
    children?: CreateItemAdminDto[];
}
