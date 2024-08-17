import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum UserRole {
  HOST_MANAGER = 'host_manager',
  HOST_OPERATOR = 'host_operator',
  TEACHER = 'teacher',
  TEACHER_STAFF = 'teacher_staff',
  PARENT = 'parent',
  CHILD = 'child',
}

@Entity()
export class UsersModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  userId: string; // 이메일 형식의 사용자 ID

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'int', nullable: true })
  grade: number; // 1-12 학년

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: UserRole, nullable: true })
  userRole: UserRole;

  @Column({ nullable: true })
  teacherCode: string; // 선생님 또는 TEACHER_STAFF 역할일 경우 필요

  @ManyToOne(() => UsersModel, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: UsersModel;

  @Column({ nullable: true })
  parentId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}