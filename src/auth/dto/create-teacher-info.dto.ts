import { IsString, IsBoolean, IsOptional, IsUrl, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeachersInfoDto {
    @IsString()
    @ApiProperty({
        description: '교사의 이름',
        example: '김철수',
    })
    teacherName: string;

    @IsString()
    @ApiProperty({
        description: '교사 소개',
        example: '수학 교육 경력 10년의 전문 교사입니다.',
    })
    teacherIntroduction: string;

    @IsUrl()
    @ApiProperty({
        description: '교사 이미지 URL',
        example: 'https://example.com/teacher-image.jpg',
    })
    imageUrl: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        description: '프로필 표시 여부',
        example: true,
        required: false,
        default: true,
    })
    visibilityYn?: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        description: '사업자 여부',
        example: true,
        required: false,
        default: true,
    })
    businessPerson?: boolean;

    @IsString()
    @ApiProperty({
        description: '사업자 등록 번호',
        example: '123-45-67890',
    })
    registrationNumber: string;

    @IsUrl()
    @ApiProperty({
        description: '사업자 등록증 URL',
        example: 'https://example.com/registration-document.pdf',
    })
    registrationNumberUrl: string;

    @IsPhoneNumber()
    @ApiProperty({
        description: '주요 연락처',
        example: '010-1234-5678',
    })
    mainContactNumber: string;

    @IsString()
    @ApiProperty({
        description: '계좌 소유자 이름',
        example: '김철수',
    })
    accountHolder: string;

    @IsString()
    @ApiProperty({
        description: '은행 코드',
        example: '004',
    })
    bankCode: string;

    @IsString()
    @ApiProperty({
        description: '계좌 번호',
        example: '123456-78-901234',
    })
    accountNumber: string;

    @IsUrl()
    @ApiProperty({
        description: '통장 사본 URL',
        example: 'https://example.com/bankbook-copy.jpg',
    })
    bankBookCopyUrl: string;

    @IsString()
    @ApiProperty({
        description: '매니저 코드',
        example: 'MGR001',
    })
    managerCode: string;
}