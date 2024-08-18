import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product.category.entity';
import { Repository, DataSource, QueryRunner, IsNull, TreeRepository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-product-category';

@Injectable()
export class ProductAdminService {

    private treeRepository: TreeRepository<ProductCategory>;


    constructor(
        @InjectRepository(ProductCategory)
        private readonly productCategoryRepository: Repository<ProductCategory>,
        private dataSource: DataSource
    ) {
        this.treeRepository = this.dataSource.getTreeRepository(ProductCategory);
    }


    async getCategoryTree(): Promise<any> {
        try {
            const trees = await this.treeRepository.findTrees();
            return trees.map(tree => this.mapCategoryToTreeNode(tree));
        } catch (err) {
            throw new InternalServerErrorException('Failed to get category tree', err.message);
        }
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

    async createCategoryStructures(createCategoryDtos: CreateCategoryDto[]): Promise<ProductCategory[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.deleteAllCategories();
            await this.createCategories(createCategoryDtos, null, queryRunner);
            await queryRunner.commitTransaction();

            // 모든 깊이의 자식 카테고리를 포함하여 조회
            return this.productCategoryRepository.find({
                relations: ['children', 'children.children', 'children.children.children'],
                where: { parent: IsNull() }
            });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Failed to create category structures', err.message);
        } finally {
            await queryRunner.release();
        }
    }

    private async createCategories(
        dtos: CreateCategoryDto[],
        parent: ProductCategory | null,
        queryRunner: QueryRunner
    ): Promise<void> {
        for (const dto of dtos) {
            const category = queryRunner.manager.create(ProductCategory, {
                name: dto.name,
                folderPath: dto.folderPath,
                folderColor: dto.folderColor,
                parent: parent
            });

            const savedCategory = await queryRunner.manager.save(ProductCategory, category);

            if (dto.children && dto.children.length > 0) {
                await this.createCategories(dto.children, savedCategory, queryRunner);
            }
        }
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