import { Subject } from 'src/curriculum/entities/subject.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

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

    @Column({ type: 'int', nullable: true })
    grade: number;

    @ManyToMany(() => Subject)
    @JoinTable({
        name: 'teacher_subjects', // 중간 테이블의 이름
        joinColumn: {
            name: 'teacherId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'subjectId',
            referencedColumnName: 'id',
        },
    })
    subjects: Subject[];
}