import { faker } from '@faker-js/faker/locale/ko';
import { CreateTeachersInfoDto } from 'src/auth/dto/create-teacher-info.dto';

export function generateRandomTeacherData(): CreateTeachersInfoDto {
    return {
        teacherName: faker.person.fullName(),
        teacherIntroduction: faker.lorem.paragraph(),
        imageUrl: faker.image.avatar(),
        visibilityYn: faker.datatype.boolean(),
        businessPerson: faker.datatype.boolean(),
        registrationNumber: faker.finance.accountNumber(10),
        registrationNumberUrl: faker.image.url(),
        mainContactNumber: faker.phone.number('010-####-####'),
        accountHolder: faker.person.fullName(),
        bankCode: faker.finance.accountNumber(3),
        accountNumber: faker.finance.accountNumber(14),
        bankBookCopyUrl: faker.image.url(),
        managerCode: `MGR${faker.string.numeric(3)}`,
    };
}

