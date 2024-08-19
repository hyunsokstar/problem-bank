// item-admin-response.dto.ts

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

export class PaginatedItemAdminResponseDto {
    pageNum: number;
    pageSize: number;
    totalCount: number;
    contents: ItemAdminResponseDto[];
    first: boolean;
    last: boolean;
    empty: boolean;
}