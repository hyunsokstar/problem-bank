// create-product-category.dto.ts
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
    @IsString()
    name: string;

    @IsString()
    folderPath: string;

    @IsString()
    @IsOptional()
    folderColor?: string;

    @ValidateNested({ each: true })
    @Type(() => CreateCategoryDto)
    @IsOptional()
    children?: CreateCategoryDto[];
}