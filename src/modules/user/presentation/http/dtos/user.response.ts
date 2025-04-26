import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'user 고유 Id',
    example: '4dcc664b-93f2-4179-9ff1-d838164feb54',
  })
  id: string;

  @ApiProperty({
    description: 'user nickname(랜덤 생성)',
    example: 'user5394',
  })
  nickname: string;

  @ApiProperty({
    description: '가입 일자',
    example: '2025-04-14 10:13:41',
  })
  createdAt: string;
}
