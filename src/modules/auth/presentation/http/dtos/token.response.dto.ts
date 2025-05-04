import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({ description: 'The access token for authentication' })
  accessToken: string;
}
