// src/users/dto/generated-teachers-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { CreateTeachersInfoDto } from './create-teacher-info.dto';

export class GeneratedTeachersResponseDto {
    @ApiProperty({
        description: '생성된 교사 정보 목록',
        type: [CreateTeachersInfoDto],
        example: [
            {
                teacherName: '김철수',
                teacherIntroduction: '수학 교육 경력 10년의 전문 교사입니다.',
                imageUrl: 'https://example.com/teacher1-image.jpg',
                visibilityYn: true,
                businessPerson: true,
                registrationNumber: '123-45-67890',
                registrationNumberUrl: 'https://example.com/registration-document1.pdf',
                mainContactNumber: '010-1234-5678',
                accountHolder: '김철수',
                bankCode: '004',
                accountNumber: '123456-78-901234',
                bankBookCopyUrl: 'https://example.com/bankbook-copy1.jpg',
                managerCode: 'MGR001'
            },
            {
                teacherName: '이영희',
                teacherIntroduction: '영어 회화 전문 강사입니다.',
                imageUrl: 'https://example.com/teacher2-image.jpg',
                visibilityYn: true,
                businessPerson: false,
                registrationNumber: '234-56-78901',
                registrationNumberUrl: 'https://example.com/registration-document2.pdf',
                mainContactNumber: '010-2345-6789',
                accountHolder: '이영희',
                bankCode: '003',
                accountNumber: '234567-89-012345',
                bankBookCopyUrl: 'https://example.com/bankbook-copy2.jpg',
                managerCode: 'MGR002'
            }
            // 추가 예시 데이터는 생략...
        ]
    })
    teachers: CreateTeachersInfoDto[];
}