import { IBirdResponseDto } from '~/modules/bird/application/interfaces/bird-reader.service.interface';
import { Goal } from '~/modules/goal/domain/models/goal';

export class GoalWithBirdDto {
  goal: Goal;
  bird: IBirdResponseDto;
}
