import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'user 고유 Id' })
  id: string;

  @ApiProperty({ description: 'user nickname(랜덤 생성)' })
  nickname: string;

  @ApiProperty({ description: '가입 일자' })
  createdAt: string;
}
