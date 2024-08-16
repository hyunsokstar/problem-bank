import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateSubjectDto } from './dto/create-subject-dto';
import { Subject } from './entities/subject.entity';

@Injectable()
export class CurriculumService {
    constructor(
        @InjectRepository(Subject)
        private readonly subjectRepository: Repository<Subject>,
    ) { }

    async findAllSubjects(page: number = 1, perPage: number = 10): Promise<{
        subjects: Subject[],
        totalPages: number,
        totalElements: number,
        perPage: number,
        first: boolean,
        last: boolean,
        empty: boolean
    }> {
        const [subjects, totalCount] = await this.subjectRepository.findAndCount({
            skip: (page - 1) * perPage,
            take: perPage,
            order: { id: 'ASC' }
        });

        const totalPages = Math.ceil(totalCount / perPage);

        return {
            subjects,
            totalPages,
            totalElements: totalCount,
            perPage: perPage,
            first: page === 1,
            last: page === totalPages,
            empty: subjects.length === 0
        };
    }

    async deleteSubject(id: number): Promise<void> {
        const result = await this.subjectRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Subject with ID "${id}" not found`);
        }
    }

    async createSubject(createSubjectDto: CreateSubjectDto): Promise<Subject> {
        const newSubject = this.subjectRepository.create(createSubjectDto);
        return await this.subjectRepository.save(newSubject);
    }

}
