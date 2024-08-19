import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { ItemAdminService } from './item-admin.service';
import { CreateItemAdminDto } from './dto/create-item-admin.dto';
import { ItemsModel } from './entities/item-admin.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItemAdminResponseDto } from './dto/item-admin-response.dto';

@Controller('item-admin')
export class ItemAdminController {
  constructor(private readonly itemAdminService: ItemAdminService) { }

  @Get()
  @ApiOperation({ summary: 'Get all items in hierarchical structure' })
  @ApiResponse({
    status: 200,
    description: 'Return all items in a tree structure.',
    type: [ItemAdminResponseDto]
  })
  @ApiTags('item-admin/get')
  async findAll(): Promise<ItemAdminResponseDto[]> {
    return this.itemAdminService.findAll();
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
