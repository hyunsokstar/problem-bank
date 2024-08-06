import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel, UserType } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) { }

  // @Delete('admin/delete-all-users')
  // async deleteAllUsers() {
  //   return await this.usersService.deleteAllUsers();
  // } 에 대한 서비스

  async deleteAllUsers(): Promise<void> {
    await this.usersRepository.delete({});
  }

  async findUsersForTestDataGrid(
    page: number = 0,
    size: number = 10,
  ): Promise<{
    totalPages: number;
    totalElements: number;
    size: number;
    content: Partial<UsersModel>[];
    number: number;
    sort: any[];
    numberOfElements: number;
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: any[];
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    first: boolean;
    last: boolean;
    empty: boolean;
  }> {
    const [users, total] = await this.usersRepository.findAndCount({
      select: ['id', 'email', 'name', 'age', 'gender', 'hobby'],
      skip: page * size,
      take: size,
    });

    const totalPages = Math.ceil(total / size);

    return {
      totalPages,
      totalElements: total,
      size,
      content: users,
      number: page,
      sort: [],
      numberOfElements: users.length,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: [],
        offset: page * size,
        paged: true,
        unpaged: false,
      },
      first: page === 0,
      last: page === totalPages - 1,
      empty: users.length === 0,
    };
  }

  async findAll(): Promise<UsersModel[]> {
    return await this.usersRepository.find();
  }

  async findTeachers(): Promise<Partial<UsersModel>[]> {
    const teachers = await this.usersRepository.find({
      where: {
        role: UserType.TEACHER,
        is_visible: true,
      },
      select: [
        'email',
        'name',
        'role',
        'join_date',
        'is_visible',
        'teacher_code',
      ], // 필요한 필드만 선택
    });

    return teachers.map((teacher) => ({
      email: teacher.email,
      name: teacher.name,
      role: teacher.role,
      join_date: teacher.join_date,
      is_visible: teacher.is_visible,
      teacher_code: teacher.teacher_code,
    }));
  }
}
