import { Column, Entity } from 'typeorm';

import { CoreEntity } from '~/common/entities/Core.entity';

@Entity({
  name: 'banners',
  comment: '배너 테이블',
})
export class BannerEntity extends CoreEntity {
  @Column({
    type: 'varchar',
    name: 'title',
    comment: '배너 제목',
  })
  title: string;

  @Column({
    type: 'varchar',
    name: 'image_url',
    comment: '배너 이미지 URL',
  })
  imageUrl: string;

  @Column({
    type: 'varchar',
    name: 'link',
    comment: '배너 연결 링크',
  })
  link: string;
}
