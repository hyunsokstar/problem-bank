import { Entity, Column, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, JoinColumn } from 'typeorm';

@Entity()
@Tree("closure-table")
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column()
    folderPath: string;

    @Column({ nullable: true })
    folderColor?: string;

    @TreeChildren({ cascade: true })
    @JoinColumn()
    children: ProductCategory[];

    @TreeParent({ onDelete: 'CASCADE' })
    parent: ProductCategory;
}