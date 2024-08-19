import { Test, TestingModule } from '@nestjs/testing';
import { ItemAdminService } from './item-admin.service';

describe('ItemAdminService', () => {
  let service: ItemAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemAdminService],
    }).compile();

    service = module.get<ItemAdminService>(ItemAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
