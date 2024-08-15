import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel, UserType } from './entities/user.entity';
import { Repository } from 'typeorm';
import { TeachersInfo } from './entities/teachers-info.entity';
import { CreateTeachersInfoDto } from 'src/auth/dto/create-teacher-info.dto';
import { generateRandomTeacherData } from 'src/utils/teacher-data-generator';
import { TeachersInfoPaginationDto } from 'src/auth/dto/teachers-info-pagination.dto';
import { CreateSubjectDto } from './dto/create-subject-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    @InjectRepository(TeachersInfo)
    private readonly teachersInfoRepository: Repository<TeachersInfo>,


  ) { }

  async getTeachersInfoList(
    page: number = 0,
    perPage: number = 20,
    searchTerm: string = '',
    searchType: string = 'teacherName'
  ): Promise<TeachersInfoPaginationDto> {
    const queryBuilder = this.teachersInfoRepository.createQueryBuilder('teacherInfo');

    if (searchTerm && searchType) {
      switch (searchType) {
        case 'teacherName':
          queryBuilder.where('teacherInfo.teacherName LIKE :searchTerm', { searchTerm: `%${searchTerm}%` });
          break;
        case 'teacherSubject':
          queryBuilder
            .leftJoinAndSelect('teacherInfo.subjects', 'subject')
            .where('subject.subject LIKE :searchTerm', { searchTerm: `%${searchTerm}%` });
          break;
        case 'teacehrGrade':  // Note: this is the spelling used in the question
          queryBuilder.where('teacherInfo.grade = :grade', { grade: parseInt(searchTerm) });
          break;
        default:
          // If no valid search type is provided, don't apply any filter
          break;
      }
    }

    const [teachersInfoList, totalCount] = await queryBuilder
      .skip(page * perPage)
      .take(perPage)
      .getManyAndCount();

    const totalPages = Math.ceil(totalCount / perPage);
    const totalElements = totalCount;

    return {
      teachersInfoList,
      totalPages,
      totalElements,
      perPage,
      first: page === 0,
      last: page === totalPages - 1,
      empty: teachersInfoList.length === 0
    };
  }

  // createTeachersInfo 함수 추가
  async createTeachersInfo(createTeachersInfoDto: CreateTeachersInfoDto): Promise<TeachersInfo> {
    const existingTeacher = await this.teachersInfoRepository.findOne({
      where: [
        { teacherName: createTeachersInfoDto.teacherName },
        { registrationNumber: createTeachersInfoDto.registrationNumber },
        { mainContactNumber: createTeachersInfoDto.mainContactNumber },
      ],
    });

    if (existingTeacher) {
      throw new ConflictException('Teacher with this name, registration number, or contact number already exists');
    }

    const newTeachersInfo = this.teachersInfoRepository.create(createTeachersInfoDto);
    return await this.teachersInfoRepository.save(newTeachersInfo);
  }

  async generateAndCreateRandomTeachers(count: number = 10): Promise<TeachersInfo[]> {
    const createdTeachers: TeachersInfo[] = [];

    for (let i = 0; i < count; i++) {
      const randomTeacherData = generateRandomTeacherData();
      try {
        const newTeacher = await this.createTeachersInfo(randomTeacherData);
        createdTeachers.push(newTeacher);
      } catch (error) {
        if (error instanceof ConflictException) {
          console.warn(`Skipping duplicate teacher: ${randomTeacherData.teacherName}`);
          i--; // Retry with a new random teacher
        } else {
          throw error;
        }
      }
    }

    return createdTeachers;
  }

  // async createMultipleTeachersInfo(createTeachersInfoDtoList: CreateTeachersInfoDto[]): Promise<TeachersInfo[]> {
  //   const newTeachersInfoList: TeachersInfo[] = [];

  //   for (const dto of createTeachersInfoDtoList) {
  //     try {
  //       const newTeacherInfo = await this.createTeachersInfo(dto);
  //       newTeachersInfoList.push(newTeacherInfo);
  //     } catch (error) {
  //       if (error instanceof ConflictException) {
  //         console.warn(`Skipping duplicate teacher: ${dto.teacherName}`);
  //       } else {
  //         throw error;
  //       }
  //     }
  //   }

  //   return newTeachersInfoList;
  // }

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
    // 2초 지연
    await new Promise((resolve) => setTimeout(resolve, 1000));

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

  async deleteAllUsers(): Promise<void> {
    await this.usersRepository.delete({});
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
