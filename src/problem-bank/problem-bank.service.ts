import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/user.entity';
import { DataSource, In, Repository, TreeRepository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Problem } from './entities/problem.entity';
import { CreateProblemDto } from './dto/create-problem-dto';
import { CreateAnswerOptionDto } from './dto/create-answer-option.dto';
import { AnswerOption } from './entities/answer-option.entity';
import { ExamFolder } from './entities/exam-folder.entity';
import { CreateExamFolderDto } from './dto/create-exam-folder.dto';

@Injectable()
export class ProblemBankService {

  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,

    @InjectRepository(ExamFolder)
    private examFolderRepository: TreeRepository<ExamFolder>,

    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,

    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,

    @InjectRepository(AnswerOption)
    private readonly answerOptionRepository: Repository<AnswerOption>,

    // private readonly logger = new Logger(ProblemBankService.name),

    private dataSource: DataSource
  ) { }

  // 특정 폴더에 대해 exam 추가
  async createExamForFolder(folderId: number, createExamDto: CreateExamDto) {
    const folder = await this.examFolderRepository.findOne({ where: { id: folderId } });
    if (!folder) {
      throw new NotFoundException(`Folder with ID ${folderId} not found`);
    }

    const examiner = await this.usersRepository.findOne({ where: { id: createExamDto.examinerId } });
    if (!examiner) {
      throw new NotFoundException(`Examiner with ID ${createExamDto.examinerId} not found`);
    }

    const exam = this.examRepository.create({
      ...createExamDto,
      examiner,
      folder,
    });

    return this.examRepository.save(exam);
  }


  async createMultipleExamFolders(createExamFolderDtos: CreateExamFolderDto[]): Promise<ExamFolder[]> {
    const createdFolders: ExamFolder[] = [];

    for (const dto of createExamFolderDtos) {
      const { name, type } = dto;
      let parent: ExamFolder | null = null;

      // parentId가 제공된 경우에만 부모 폴더를 찾습니다.
      if (dto.parentId !== undefined) {
        parent = await this.examFolderRepository.findOne({ where: { id: dto.parentId } });
        if (!parent) {
          throw new NotFoundException(`Parent folder with ID ${dto.parentId} not found`);
        }
      }

      const newFolder = this.examFolderRepository.create({
        name,
        type,
        parent,
      });

      const savedFolder = await this.examFolderRepository.save(newFolder);
      createdFolders.push(savedFolder);
    }

    return createdFolders;
  }

  async getExamFolderTree(depth: number = 3): Promise<ExamFolder[]> {
    try {
      const folders = await this.examFolderRepository.findTrees({
        relations: ['exams', 'exams.examiner'],
        depth: depth
      });
      return folders;
    } catch (error) {
      console.log("error: ", error);
      throw new InternalServerErrorException('Failed to fetch exam folder tree');
    }
  }

  private buildTree(folders: ExamFolder[]): ExamFolder[] {
    const folderMap = new Map<number, ExamFolder>();
    folders.forEach(folder => folderMap.set(folder.id, { ...folder, children: [] }));

    const rootFolders: ExamFolder[] = [];
    folders.forEach(folder => {
      if (folder.parent) {
        const parent = folderMap.get(folder.parent.id);
        if (parent) {
          parent.children.push(folderMap.get(folder.id)!);
        }
      } else {
        rootFolders.push(folderMap.get(folder.id)!);
      }
    });

    return rootFolders;
  }

  async createExamFolder(createExamFolderDto: CreateExamFolderDto): Promise<ExamFolder> {
    const { name, type, parentId } = createExamFolderDto;
    let parent: ExamFolder | null = null;

    if (parentId) {
      parent = await this.examFolderRepository.findOne({ where: { id: parentId } });
      if (!parent) {
        throw new NotFoundException(`Parent folder with ID ${parentId} not found`);
      }
    }

    const newFolder = this.examFolderRepository.create({
      name,
      type,
      parent,
    });

    return this.examFolderRepository.save(newFolder);
  }

  async removeProblemsForExam(id: number) {
    const exam = await this.examRepository.findOne({ where: { id } });
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    await this.problemRepository.delete({ exam });
  }

  async removeExam(id: number) {
    const exam = await this.examRepository.findOne({ where: { id } });
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    await this.examRepository.remove(exam);
  }

  async createMultiProblem(examId: number, createProblemDto: CreateProblemDto[]) {
    return this.dataSource.transaction(async transactionalEntityManager => {
      const exam = await transactionalEntityManager.findOne(Exam, {
        where: { id: examId },
        relations: ['problems']
      });

      if (!exam) {
        throw new NotFoundException(`Exam with ID ${examId} not found`);
      }

      const existingProblemCount = exam.problems.length;
      const newProblemCount = createProblemDto.length;
      const totalProblemCount = existingProblemCount + newProblemCount;

      if (totalProblemCount > 20) {
        throw new BadRequestException(`Total number of problems (${totalProblemCount}) exceeds the maximum limit of 20`);
      }

      // Find the maximum order number from existing problems
      const maxOrder = exam.problems.length > 0
        ? Math.max(...exam.problems.map(p => p.order))
        : 0;

      const problems = await Promise.all(createProblemDto.map(async (dto, index) => {
        // If order is not provided, use maxOrder + index + 1
        const order = dto.order || maxOrder + index + 1;

        const problem = transactionalEntityManager.create(Problem, {
          order: order,
          question: dto.question,
          image: dto.image,
          correctOptionId: dto.correctOptionId,
          exam,
        });

        const savedProblem = await transactionalEntityManager.save(problem);

        const options = dto.options.map(optionDto =>
          transactionalEntityManager.create(AnswerOption, {
            text: optionDto.text,
            problem: savedProblem,
          })
        );

        await transactionalEntityManager.save(options);

        return savedProblem;
      }));

      return problems;
    });
  }

  async getAllProblemForExamId(examId: number) {
    const exam = await this.examRepository.findOne({
      where: { id: examId }, relations: ['examiner', 'problems']
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${examId} not found`);
    }

    const examName = exam.name
    const examiner = exam.examiner
    const problems = await this.problemRepository.find({ where: { exam: { id: exam.id } }, relations: ['options'] });

    console.log("problems.length for 3: ", problems.length);


    return {
      examName,
      examiner,
      problems
    }

    // return await this.problemRepository.find({ where: { exam }, relations: ['options'] });
  }

  // 특정 문제에 대해 옵션 5개 한번에 추가
  // @Post('problem/:problemId/options')
  // @HttpCode(HttpStatus.CREATED)
  // async createAnswerOptions(
  //   @Param('problemId', ParseIntPipe) problemId: number,
  //   @Body() createAnswerOptionsDto: CreateAnswerOptionDto[]
  // ) {
  //   const result = await this.problemBankService.createAnswerOptions(problemId, createAnswerOptionsDto);
  //   return result;
  // } 에 대한 서비스 함수 추가
  async createAnswerOptions(problemId: number, createAnswerOptionsDto: CreateAnswerOptionDto[]) {
    try {
      if (createAnswerOptionsDto.length > 5) {
        throw new BadRequestException('Cannot create more than 5 answer options');
      }

      const problem = await this.problemRepository.findOne({ where: { id: problemId } });
      if (!problem) {
        throw new NotFoundException(`Problem with ID ${problemId} not found`);
      }

      const options = createAnswerOptionsDto.map(dto => this.answerOptionRepository.create({
        ...dto,
        problem,
      }));

      const savedOptions = await this.answerOptionRepository.save(options);

      return {
        success: true,
        message: 'Answer options created successfully',
        data: savedOptions.map(option => ({
          id: option.id,
          text: option.text,
          problemId: problem.id,
        })),
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create answer options');
    }
  }

  async createAnswerOption(problemId: number, createAnswerOptionDto: CreateAnswerOptionDto) {
    try {
      const problem = await this.problemRepository.findOne({ where: { id: problemId } });
      if (!problem) {
        throw new NotFoundException(`Problem with ID ${problemId} not found`);
      }

      const option = this.answerOptionRepository.create({
        ...createAnswerOptionDto,
        problem,
      });

      const savedOption = await this.answerOptionRepository.save(option);

      return {
        success: true,
        message: 'Answer option created successfully',
        data: {
          id: savedOption.id,
          text: savedOption.text,
          problemId: problem.id,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create answer option');
    }
  }

  // @Delete('problem/:id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // removeProblem(@Param('id', ParseIntPipe) id: number) {
  //   return this.problemBankService.removeProblem(id);
  // } 에 대한 서비스 함수 추가
  async removeProblem(id: number) {
    const problem = await this.problemRepository.findOne({ where: { id } });
    if (!problem) {
      throw new NotFoundException(`Problem with ID ${id} not found`);
    }

    await this.problemRepository.remove(problem);
  }

  async createProblem(examId: number, createProblemDto: CreateProblemDto) {
    const exam = await this.examRepository.findOne({ where: { id: examId } });
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${examId} not found`);
    }

    const problem = this.problemRepository.create({
      ...createProblemDto,
      exam,
    });

    return this.problemRepository.save(problem);
  }

  // getAllExamList
  async getAllExamList() {
    // return await this.examRepository.find();
    // 각 시험의 문제들도 같이 가져오기
    // return await this.examRepository.find({ relations: ['problems'] });
    return await this.examRepository.find({ relations: ['examiner', 'problems', 'problems.options'] });
  }

  // getAllExamListOnly
  // exam list
  // @Get('exam-only/')
  // findAllExamOnly() {
  //   return this.problemBankService.getAllExamListOnly();
  // } 에 대한 서비스 함수 추가
  async getAllExamListOnly() {
    return await this.examRepository.find();
  }

  // exam 생성
  async createOneExam(createExamDto: CreateExamDto) {
    if (!createExamDto.examinerId) {
      throw new Error('ExaminerId is required');
    }

    const newExam = this.examRepository.create({
      ...createExamDto,
      examiner: { id: createExamDto.examinerId },
    });

    await this.examRepository.save(newExam);
    return newExam;
  }

  async updateOneExam(id: number, updateExamDto: UpdateExamDto) {
    const exam = await this.examRepository.findOne({ where: { id } });
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    // examinerId와 examineeId를 별도로 처리
    if (updateExamDto.examinerId) {
      const examiner = await this.usersRepository.findOne({ where: { id: updateExamDto.examinerId } });
      if (!examiner) {
        throw new NotFoundException(`Examiner with ID ${updateExamDto.examinerId} not found`);
      }
      exam.examiner = examiner;
    }

    // 나머지 필드 업데이트
    Object.assign(exam, updateExamDto);


    try {
      return await this.examRepository.save(exam);
    } catch (error) {
      throw new BadRequestException('Failed to update exam. Please check your input.');
    }
  }

}
