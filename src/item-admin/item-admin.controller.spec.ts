import { Test, TestingModule } from '@nestjs/testing';
import { ItemAdminController } from './item-admin.controller';
import { ItemAdminService } from './item-admin.service';

describe('ItemAdminController', () => {
  let controller: ItemAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemAdminController],
      providers: [ItemAdminService],
    }).compile();

    controller = module.get<ItemAdminController>(ItemAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
