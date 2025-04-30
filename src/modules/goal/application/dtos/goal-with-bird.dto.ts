import { BirdResponseDto } from '~/modules/bird/application/dtos/bird.response';
import { Goal } from '~/modules/goal/domain/models/goal';

export class GoalWithBirdDto {
  goal: Goal;
  bird: BirdResponseDto;
}
