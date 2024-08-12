// src/problem-bank/entities/exam-folder.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { Exam } from './exam.entity';

@Entity()
@Tree("closure-table")
export class ExamFolder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @TreeChildren()
    children: ExamFolder[];

    @TreeParent()
    parent: ExamFolder;

    @OneToMany(() => Exam, exam => exam.folder)
    exams: Exam[];
}