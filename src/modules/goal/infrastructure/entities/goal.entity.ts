import { Column, Entity } from 'typeorm';

import { CoreEntity } from '~/common/entities/Core.entity';

@Entity({
  name: 'goals',
  comment: '목표 테이블',
})
export class GoalEntity extends CoreEntity {
  @Column({
    type: 'varchar',
    name: 'user_id',
    comment: '사용자 ID',
  })
  userId: string;

  @Column({
    type: 'varchar',
    name: 'bird_id',
    comment: '새 ID',
  })
  birdId: string;

  @Column({
    type: 'boolean',
    name: 'is_completed',
    comment: '완료 여부',
  })
  isCompleted: boolean;
}
