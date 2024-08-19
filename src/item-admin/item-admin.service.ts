import { Injectable } from '@nestjs/common';
import { ItemsModel } from './entities/item-admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemAdminDto } from './dto/create-item-admin.dto';

@Injectable()
export class ItemAdminService {

  constructor(
    @InjectRepository(ItemsModel)
    private itemsRepository: Repository<ItemsModel>,
  ) { }

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


  async findAll(): Promise<ItemsModel[]> {
    const items = await this.itemsRepository.find(); // relations: ['parent'] 제거

    return this.buildTree(items);
  }

  private buildTree(items: ItemsModel[]): ItemsModel[] {
    const itemMap = new Map<number, ItemsModel>();

    items.forEach(item => {
      item.children = [];
      itemMap.set(item.id, item);
    });

    const tree: ItemsModel[] = [];

    items.forEach(item => {
      if (item.parentId) {
        const parent = itemMap.get(item.parentId);
        if (parent) {
          parent.children.push(item);
        }
      } else {
        tree.push(item);
      }
    });

    return tree;
  }

}
