import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UsersModel } from '../../users/entities/user.entity';
import { Problem } from './problem.entity';
import { ExamFolder } from './exam-folder.entity';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'examiner_id' })
    examiner: UsersModel;

    @OneToMany(() => Problem, problem => problem.exam)
    problems: Problem[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => ExamFolder, folder => folder.exams, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'folder_id' })
    folder: ExamFolder; // 폴더와의 관계 추가
}
