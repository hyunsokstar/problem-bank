import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeachersInfo } from "./teachers-info.entity";

@Entity('teacher_subjects')
export class TeacherSubject {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TeachersInfo, teacher => teacher.subjects)
    teacher: TeachersInfo;

    @Column()
    subject: string;
}