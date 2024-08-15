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

    async findAllSubjects(page: number = 1, limit: number = 10): Promise<{ subjects: Subject[], total: number }> {
        const [subjects, total] = await this.subjectRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { id: 'ASC' }
        });

        return { subjects, total };
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
