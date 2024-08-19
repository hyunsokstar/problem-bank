import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { ItemAdminService } from './item-admin.service';
import { CreateItemAdminDto } from './dto/create-item-admin.dto';
import { ItemsModel } from './entities/item-admin.entity';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedItemAdminResponseDto } from './dto/item-admin-response.dto';

@Controller('item-admin')
export class ItemAdminController {
  constructor(private readonly itemAdminService: ItemAdminService) { }

  @Get()
  @ApiOperation({ summary: '계층 구조의 모든 항목을 페이지네이션과 함께 조회' })
  @ApiResponse({
    status: 200,
    description: '트리 구조의 모든 항목을 페이지네이션 정보와 함께 반환합니다.',
    type: PaginatedItemAdminResponseDto
  })
  @ApiQuery({ name: 'pageNum', required: false, type: Number, description: '조회할 페이지 번호 (기본값: 1)' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: '페이지당 항목 수 (기본값: 10)' })
  @ApiTags('item-admin/get')
  async findAll(
    @Query('pageNum') pageNum: number = 1,
    @Query('pageSize') pageSize: number = 10
  ): Promise<PaginatedItemAdminResponseDto> {
    // pageNum과 pageSize를 사용하여 페이지네이션된 결과를 조회합니다.
    // 반환값은 페이지네이션 정보와 함께 트리 구조의 항목 목록을 포함합니다.
    return this.itemAdminService.findAll(pageNum, pageSize);
  }

  @Delete('delete-all')
  @ApiOperation({ summary: 'Delete all items' })
  @ApiResponse({ status: 200, description: 'All items have been successfully deleted.' })
  @ApiTags('item-admin/delete')
  async deleteAll() {
    return this.itemAdminService.deleteAll();
  }

  @Post('bulk')
  @ApiTags('item-admin/post')
  @ApiOperation({ summary: 'Create a bulk of items with hierarchical structure' })
  @ApiResponse({ status: 201, description: 'The items have been successfully created.' })
  @ApiBody({
    type: [CreateItemAdminDto],
    examples: {
      example1: {
        summary: 'Example with hierarchical structure',
        description: 'An example of creating items with hierarchical structure',
        value: [
          {
            "name": "정승재",
            "folderPath": "/정승재",
            "children": [
              {
                "name": "초등학교",
                "folderPath": "/정승재/초등학교"
              },
              {
                "name": "중학교",
                "folderPath": "/정승재/중학교"
              }
            ]
          },
          {
            "name": "설민석",
            "folderPath": "/설민석",
            "children": [
              {
                "name": "고등학교",
                "folderPath": "/설민석/고등학교"
              },
              {
                "name": "대학교",
                "folderPath": "/설민석/대학교",
                "children": [
                  {
                    "name": "한국사",
                    "folderPath": "/설민석/대학교/한국사"
                  },
                  {
                    "name": "세계사",
                    "folderPath": "/설민석/대학교/세계사"
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  })
  async createBulk(@Body() createItemAdminDtos: CreateItemAdminDto[]): Promise<ItemsModel[]> {
    return this.itemAdminService.createBulk(createItemAdminDtos);
  }
}
