import { Column, Entity } from 'typeorm';

import { CoreEntity } from '~/common/entities/Core.entity';

@Entity({
  name: 'files',
  comment: '파일 테이블',
})
export class FileEntity extends CoreEntity {
  @Column({
    type: 'varchar',
    name: 'filename',
    comment: '파일 이름',
  })
  filename: string;

  @Column({
    type: 'varchar',
    name: 'originalName',
    comment: '원본 파일 이름',
  })
  originalName: string;

  @Column({
    type: 'varchar',
    name: 'mimeType',
    comment: 'MIME 타입',
  })
  mimeType: string;

  @Column({
    type: 'int',
    name: 'size',
    comment: '파일 크기',
  })
  size: number;

  @Column({
    type: 'varchar',
    name: 'path',
    comment: '파일 경로',
  })
  path: string;

  @Column({
    type: 'varchar',
    name: 'url',
    comment: '파일 접근 URL',
  })
  url: string;
}
