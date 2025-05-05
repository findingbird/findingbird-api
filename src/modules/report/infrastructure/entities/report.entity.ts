import { Column, Entity } from 'typeorm';

import { CoreEntity } from '~/common/entities/Core.entity';

@Entity({
  name: 'reports',
  comment: '충돌 신고 테이블',
})
export class ReportEntity extends CoreEntity {
  @Column({
    type: 'varchar',
    name: 'user_id',
    comment: '사용자 ID',
  })
  userId: string;

  @Column({
    type: 'varchar',
    name: 'title',
    comment: '제목',
  })
  title: string;

  @Column({
    type: 'int',
    name: 'bird_count',
    comment: '개체 수',
  })
  birdCount: number;

  @Column({
    type: 'varchar',
    name: 'collision_site_type',
    comment: '충돌 장소 유형',
  })
  collisionSiteType: string;

  @Column({
    type: 'boolean',
    name: 'mitigation_applied',
    comment: '저감 조치 적용 여부',
  })
  mitigationApplied: boolean;

  @Column({
    type: 'varchar',
    name: 'species_info',
    comment: '생물종 정보',
  })
  speciesInfo: string;

  @Column({
    type: 'varchar',
    name: 'observation_location',
    comment: '관찰 위치',
  })
  observationLocation: string;

  @Column({
    type: 'varchar',
    name: 'description',
    comment: '관찰 내역',
  })
  description: string;

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
}
