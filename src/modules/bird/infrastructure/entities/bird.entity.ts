import { Column, Entity } from 'typeorm';

import { CoreEntity } from '~/common/entities/Core.entity';

@Entity({
  name: 'birds',
  comment: '새 테이블',
})
export class BirdEntity extends CoreEntity {
  @Column({
    type: 'varchar',
    name: 'species_name',
    comment: '종명',
  })
  speciesName: string;

  @Column({
    type: 'varchar',
    name: 'scientific_name',
    comment: '학명',
    nullable: true,
  })
  scientificName: string | null;

  @Column({
    type: 'varchar',
    name: 'habitat_type',
    comment: '서식 형태',
  })
  habitatType: string;

  @Column({
    type: 'int',
    name: 'appearance_count',
    comment: '등장 횟수',
  })
  appearanceCount: number;

  @Column({
    type: 'text',
    name: 'morpho_trait',
    comment: '형태특성',
    nullable: true,
  })
  morphoTrait: string | null;

  @Column({
    type: 'text',
    name: 'eco_trait',
    comment: '생태특성',
    nullable: true,
  })
  ecoTrait: string | null;

  @Column({
    type: 'text',
    array: true,
    name: 'districts',
    comment: '자치구명',
  })
  districts: string[];

  @Column({
    type: 'varchar',
    name: 'image_url',
    comment: '이미지 URL',
  })
  imageUrl: string;
}
