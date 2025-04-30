import { ApiProperty } from '@nestjs/swagger';

import { DateUtils } from '~/common/utils/Date.utils';
import { BirdResponseDto } from '~/modules/bird/application/dtos/bird.response';
import { Goal } from '~/modules/goal/domain/models/goal';

export class GoalResponseDto {
  @ApiProperty({
    description: 'goal 고유 Id',
    example: '550e5ba2-62dd-4903-bfa7-80ac57d63721',
  })
  id: string;

  @ApiProperty({
    description: '목표 달성 여부',
    example: true,
  })
  isCompleted: boolean;

  @ApiProperty({
    description: '목표 생성 일자',
    example: '2025-04-25 21:45:23',
  })
  createdAt: string;

  @ApiProperty({
    description: '목표 새',
  })
  bird: BirdResponseDto;

  static fromDomain(goal: Goal, bird: BirdResponseDto): GoalResponseDto {
    return {
      id: goal.id,
      isCompleted: goal.isCompleted,
      createdAt: DateUtils.format(goal.createdAt),
      bird,
    };
  }
}
