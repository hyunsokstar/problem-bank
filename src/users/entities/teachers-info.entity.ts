import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TeacherSubject } from './teacher-subject.entity';

@Entity('teachers_info')
export class TeachersInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    teacherName: string;

    @Column({ type: 'text' })
    teacherIntroduction: string;

    @Column({ type: 'varchar', length: 255 })
    imageUrl: string;

    @Column({ type: 'boolean', default: true })
    visibilityYn: boolean;

    @Column({ type: 'boolean', default: true })
    businessPerson: boolean;

    @Column({ type: 'varchar', length: 255 })
    registrationNumber: string;

    @Column({ type: 'varchar', length: 255 })
    registrationNumberUrl: string;

    @Column({ type: 'varchar', length: 20 })
    mainContactNumber: string;

    @Column({ type: 'varchar', length: 255 })
    accountHolder: string;

    @Column({ type: 'varchar', length: 50 })
    bankCode: string;

    @Column({ type: 'varchar', length: 50 })
    accountNumber: string;

    @Column({ type: 'varchar', length: 255 })
    bankBookCopyUrl: string;

    @Column({ type: 'varchar', length: 50 })
    managerCode: string;

    @OneToMany(() => TeacherSubject, subject => subject.teacher)
    subjects: TeacherSubject[];

    @Column({ type: 'int', nullable: true })
    grade: number;
}
