import { PartialType } from '@nestjs/swagger';
import { CreateItemAdminDto } from './create-item-admin.dto';

export class UpdateItemAdminDto extends PartialType(CreateItemAdminDto) {}
