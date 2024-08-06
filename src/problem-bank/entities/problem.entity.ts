import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Exam } from './exam.entity';
import { AnswerOption } from './answer-option.entity';

@Entity()
export class Problem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true })
    order: number;

    @Column('text')
    question: string;

    @Column({ nullable: true })
    image: string;

    @ManyToOne(() => Exam, exam => exam.problems, { onDelete: 'CASCADE' })
    exam: Exam;

    @OneToMany(() => AnswerOption, option => option.problem, { nullable: true })
    options: AnswerOption[];

    @Column({ nullable: true })
    correctOptionId: number;
}