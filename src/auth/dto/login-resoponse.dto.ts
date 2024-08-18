import { ApiProperty } from '@nestjs/swagger';

class TokenInfo {
    @ApiProperty()
    token: string;

    @ApiProperty()
    expiresIn: number;
}

class AuthData {
    @ApiProperty()
    access: TokenInfo;

    @ApiProperty()
    refresh: TokenInfo;
}

export class LoginResponseDto {
    @ApiProperty({ example: 'OK' })
    code: string;

    @ApiProperty({ example: '요청이 성공하였습니다.' })
    message: string;

    @ApiProperty()
    data: AuthData;
}