import { TeachersInfo } from 'src/users/entities/teachers-info.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity('subjects')
export class Subject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToMany(() => TeachersInfo, teacher => teacher.subjects)
    teachers: TeachersInfo[];
}