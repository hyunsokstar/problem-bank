// src\product-admin\dto\create-product-category.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: '정승재' })
    name: string;

    @ApiProperty({ example: '/정승재' })
    folderPath: string;

    @ApiProperty({ example: '#00FF00', required: false })
    folderColor?: string;

    @ApiProperty({ type: () => [CreateCategoryDto], required: false })
    children?: CreateCategoryDto[];
}