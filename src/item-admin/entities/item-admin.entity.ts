import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('items_model')
export class ItemsModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column()
    folderPath: string;

    @Column({ nullable: true })
    folderColor?: string;

    @Column({ type: 'int', default: 0 })
    order: number;

    @Column({ type: 'int', default: 0 })
    depth: number;

    @ManyToOne(() => ItemsModel, item => item.children, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parentId' })
    parent: ItemsModel;

    @Column({ nullable: true })
    parentId: number;

    children?: ItemsModel[];

}
