export class ItemAdminResponseDto {
    id: number;
    name: string;
    folderPath: string;
    folderColor: string | null;
    order: number;
    depth: number;
    parentId: number | null;
    children: ItemAdminResponseDto[];
}