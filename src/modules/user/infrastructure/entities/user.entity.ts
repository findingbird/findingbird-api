import { Column, Entity } from 'typeorm';

import { CoreEntity } from '~/common/entities/Core.entity';

@Entity({
  name: 'users',
  comment: '사용자 정보 테이블',
})
export class UserEntity extends CoreEntity {
  @Column({
    type: 'varchar',
    name: 'nickname',
    comment: '사용자 닉네임',
  })
  nickname: string;
}
