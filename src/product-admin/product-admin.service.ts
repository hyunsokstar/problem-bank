import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product.category.entity';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { CreateCategoryDto } from './dto/create-product-category';

@Injectable()
export class ProductAdminService {
    constructor(
        @InjectRepository(ProductCategory)
        private readonly productCategoryRepository: Repository<ProductCategory>,
        private dataSource: DataSource
    ) { }

    async createCategoryStructures(createCategoryDtos: CreateCategoryDto[]): Promise<ProductCategory[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.deleteAllCategories();

            const results: ProductCategory[] = [];
            for (const dto of createCategoryDtos) {
                const result = await this.createCategoryRecursive(dto, null, queryRunner);
                results.push(result);
            }

            await queryRunner.commitTransaction();
            return results;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Failed to create category structures', err.message);
        } finally {
            await queryRunner.release();
        }
    }

    async createCategoryRecursive(
        dto: CreateCategoryDto,
        parent: ProductCategory | null,
        queryRunner: QueryRunner
    ): Promise<ProductCategory> {
        const category = new ProductCategory();
        category.name = dto.name;
        category.folderPath = dto.folderPath;
        category.parent = parent;

        const savedCategory = await queryRunner.manager.save(category);

        if (dto.children && dto.children.length > 0) {
            for (const childDto of dto.children) {
                await this.createCategoryRecursive(childDto, savedCategory, queryRunner);
            }
        }

        return savedCategory;
    }

    async deleteAllCategories(): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const rootCategories = await queryRunner.manager.find(ProductCategory, {
                where: { parent: null }
            });
            await queryRunner.manager.remove(ProductCategory, rootCategories);
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Failed to delete all categories', err.message);
        } finally {
            await queryRunner.release();
        }
    }

    async getCategoryTree(): Promise<any> {
        try {
            const categories = await this.productCategoryRepository.find({
                relations: ['parent', 'children']
            });
            return this.buildCategoryTree(categories);
        } catch (err) {
            throw new InternalServerErrorException('Failed to get category tree', err.message);
        }
    }

    private buildCategoryTree(categories: ProductCategory[]): any {
        const rootCategories = categories.filter(category => !category.parent);
        return rootCategories.map(category => this.mapCategoryToTreeNode(category));
    }

    private mapCategoryToTreeNode(category: ProductCategory): any {
        return {
            id: category.id,
            name: category.name,
            folderPath: category.folderPath,
            folderColor: category.folderColor,
            children: category.children ? category.children.map(child => this.mapCategoryToTreeNode(child)) : []
        };
    }

    async updateCategory(id: number, updateCategoryDto: Partial<CreateCategoryDto>): Promise<ProductCategory> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const category = await queryRunner.manager.findOne(ProductCategory, { where: { id } });
            if (!category) {
                throw new Error('Category not found');
            }

            Object.assign(category, updateCategoryDto);
            const updatedCategory = await queryRunner.manager.save(ProductCategory, category);

            await queryRunner.commitTransaction();
            return updatedCategory;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Failed to update category', err.message);
        } finally {
            await queryRunner.release();
        }
    }
}