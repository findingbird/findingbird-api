import { ApiProperty } from '@nestjs/swagger';

import { BirdResponseDto } from '~/modules/bird/application/dtos/bird.response';
import { Goal } from '~/modules/goal/domain/models/goal';

export class GoalResponseDto {
  @ApiProperty({
    description: 'goal 고유 Id',
    example: '550e5ba2-62dd-4903-bfa7-80ac57d63721',
  })
  id: string;

  @ApiProperty({
    description: '목표 새',
  })
  bird: BirdResponseDto;

  static fromDomain(goal: Goal, bird: BirdResponseDto): GoalResponseDto {
    return {
      id: goal.id,
      bird,
    };
  }
}
