import { Column, Entity } from 'typeorm';

import { CoreEntity } from '~/common/entities/Core.entity';

@Entity({
  name: 'records',
  comment: '관찰 기록 테이블',
})
export class RecordEntity extends CoreEntity {
  @Column({
    type: 'varchar',
    name: 'user_id',
    comment: '사용자 ID',
  })
  userId: string;

  @Column({
    type: 'varchar',
    name: 'image_file_id',
    comment: 'image 파일 ID',
  })
  imageFileId: string;

  @Column({
    type: 'varchar',
    name: 'image_url',
    comment: 'image 파일 URL',
  })
  imageUrl: string;

  @Column({
    type: 'varchar',
    name: 'name',
    comment: '새 이름',
    nullable: true,
  })
  name: string | null;

  @Column({
    type: 'varchar',
    name: 'district',
    comment: '자치구',
  })
  district: string;

  @Column({
    type: 'varchar',
    name: 'size',
    comment: '새 크기',
  })
  size: string;
  @Column({
    type: 'varchar',
    name: 'color',
    comment: '새 색상',
  })
  color: string;

  @Column({
    type: 'varchar',
    name: 'location_description',
    comment: '관찰 위치 설명',
  })
  locationDescription: string;

  @Column({
    type: 'varchar',
    name: 'goal_id',
    comment: '목표 ID',
    nullable: true,
  })
  goalId: string | null;
}
