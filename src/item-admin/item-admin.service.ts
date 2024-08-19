import { Injectable } from '@nestjs/common';
import { ItemsModel } from './entities/item-admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemAdminDto } from './dto/create-item-admin.dto';
import { ItemAdminResponseDto } from './dto/item-admin-response.dto';

@Injectable()
export class ItemAdminService {

  constructor(
    @InjectRepository(ItemsModel)
    private itemsRepository: Repository<ItemsModel>,
  ) { }

  async findAll(): Promise<ItemAdminResponseDto[]> {
    const items = await this.itemsRepository.find();
    return this.buildTree(items);
  }

  private buildTree(items: ItemsModel[]): ItemAdminResponseDto[] {
    const itemMap = new Map<number, ItemAdminResponseDto>();

    items.forEach(item => {
      const dto: ItemAdminResponseDto = {
        id: item.id,
        name: item.name,
        folderPath: item.folderPath,
        folderColor: item.folderColor,
        order: item.order,
        depth: item.depth,
        parentId: item.parentId,
        children: []
      };
      itemMap.set(item.id, dto);
    });

    const tree: ItemAdminResponseDto[] = [];

    items.forEach(item => {
      const dto = itemMap.get(item.id);
      if (item.parentId) {
        const parent = itemMap.get(item.parentId);
        if (parent) {
          parent.children.push(dto);
        }
      } else {
        tree.push(dto);
      }
    });

    return tree;
  }

  async deleteAll(): Promise<{ message: string }> {
    await this.itemsRepository.clear();
    return { message: 'All items have been deleted successfully.' };
  }

  async createBulk(createItemAdminDtos: CreateItemAdminDto[]): Promise<ItemsModel[]> {
    const items: ItemsModel[] = [];

    for (const dto of createItemAdminDtos) {
      const item = await this.saveItem(dto, null, 0, 0);
      items.push(item);
    }

    return items;
  }

  async saveItem(dto: CreateItemAdminDto, parent: ItemsModel | null, depth: number, siblingOrder: number): Promise<ItemsModel> {
    const newItem = this.itemsRepository.create({
      name: dto.name,
      folderPath: dto.folderPath,
      folderColor: dto.folderColor,
      order: siblingOrder,
      depth,
      parentId: parent ? parent.id : null,
    });

    const savedItem = await this.itemsRepository.save(newItem);

    if (dto.children && dto.children.length > 0) {
      let childOrder = 0; // 첫 자식의 order는 0부터 시작
      for (const childDto of dto.children) {
        await this.saveItem(childDto, savedItem, depth + 1, childOrder);
        childOrder++; // 다음 자식의 order는 1 증가
      }
    }

    return savedItem;
  }

}
