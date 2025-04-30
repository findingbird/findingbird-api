import { DateUtils } from '~/common/utils/Date.utils';
import { Goal, GoalProps } from '~/modules/goal/domain/models/goal';
import { GoalEntity } from '~/modules/goal/infrastructure/entities/goal.entity';

export class GoalMapper {
  static toDomain(entity: GoalEntity): Goal {
    const goalProps: GoalProps = {
      userId: entity.userId,
      birdId: entity.birdId,
      isCompleted: entity.isCompleted,
      createdAt: DateUtils.toKst(entity.createdAt),
      updatedAt: DateUtils.toKst(entity.updatedAt),
      deletedAt: entity.deletedAt ? DateUtils.toKst(entity.deletedAt) : null,
    };

    return Goal.create(entity.id, goalProps);
  }

  static toDomains(entities: GoalEntity[]): Goal[] {
    if (entities.length === 0) return [];

    return entities.map((entity) => this.toDomain(entity));
  }

  static toEntity(goal: Goal): GoalEntity {
    const goalEntity = new GoalEntity();

    goalEntity.id = goal.id;
    goalEntity.userId = goal.userId;
    goalEntity.birdId = goal.birdId;
    goalEntity.isCompleted = goal.props.isCompleted;
    goalEntity.createdAt = DateUtils.toUtcDate(goal.createdAt);
    goalEntity.updatedAt = DateUtils.toUtcDate(goal.updatedAt);
    goalEntity.deletedAt = goal.deletedAt ? DateUtils.toUtcDate(goal.deletedAt) : null;

    return goalEntity;
  }

  static toEntities(goals: Goal[]): GoalEntity[] {
    if (goals.length === 0) return [];

    return goals.map((goal) => this.toEntity(goal));
  }
}
