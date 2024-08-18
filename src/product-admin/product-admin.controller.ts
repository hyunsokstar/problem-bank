import { Controller, Post, Body, Get, Delete, HttpCode } from '@nestjs/common';
import { ProductAdminService } from './product-admin.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-product-category';

@ApiTags('product-admin')
@Controller('product-admin')
export class ProductAdminController {
  constructor(private readonly productAdminService: ProductAdminService) { }

  @Delete('categories')
  @HttpCode(204)
  @ApiOperation({ summary: '모든 제품 카테고리 삭제' })
  @ApiResponse({ status: 204, description: '모든 카테고리 삭제 성공' })
  async deleteAllCategories() {
    await this.productAdminService.deleteAllCategories();
  }

  @Get('categories')
  @ApiOperation({ summary: '제품 카테고리 트리 조회' })
  @ApiResponse({ status: 200, description: '카테고리 트리 반환 성공' })
  async getCategoryTree() {
    return this.productAdminService.getCategoryTree();
  }

  @Post('categories')
  @ApiOperation({ summary: '이전 입력 내용 삭제 + 카테고리 트리 구조 입력' })
  @ApiResponse({ status: 201, description: '카테고리 구조가 성공적으로 생성되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  @ApiBody({
    type: [CreateCategoryDto],
    description: '카테고리 구조 생성',
    examples: {
      fullExample: {
        summary: '전체 카테고리 구조 예제',
        value: [
          {
            name: '정승재',
            folderPath: '/정승재',
            children: [
              {
                name: '초등학교',
                folderPath: '/정승재/초등학교',
                children: [
                  {
                    name: '진도',
                    folderPath: '/정승재/초등학교/진도'
                  },
                  {
                    name: '개념',
                    folderPath: '/정승재/초등학교/개념'
                  }
                ]
              },
              {
                name: '중학교',
                folderPath: '/정승재/중학교'
              },
              {
                name: '고등학교',
                folderPath: '/정승재/고등학교'
              }
            ]
          },
          {
            name: '설민석',
            folderPath: '/설민석',
            children: [
              {
                name: '초등학교',
                folderPath: '/설민석/초등학교'
              },
              {
                name: '중학교',
                folderPath: '/설민석/중학교'
              },
              {
                name: '고등학교',
                folderPath: '/설민석/고등학교'
              }
            ]
          },
          {
            name: '정수아',
            folderPath: '/정수아',
            children: [
              {
                name: '초등학교',
                folderPath: '/정수아/초등학교'
              },
              {
                name: '중학교',
                folderPath: '/정수아/중학교'
              },
              {
                name: '고등학교',
                folderPath: '/정수아/고등학교'
              }
            ]
          }
        ]
      }
    }
  })
  async createCategoryStructures(@Body() createCategoryDtos: CreateCategoryDto[]) {
    return this.productAdminService.createCategoryStructures(createCategoryDtos);
  }

}