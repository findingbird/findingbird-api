import { Column, Entity, OneToMany } from 'typeorm';

import { CoreEntity } from '~/common/entities/Core.entity';
import { RefreshTokenEntity } from '~/modules/auth/infrastructure/entities/refreshToken.entity';

@Entity({
  name: 'auths',
  comment: '인증 정보 테이블',
})
export class AuthEntity extends CoreEntity {
  @Column({
    type: 'varchar',
    name: 'user_id',
    comment: '사용자 ID',
  })
  userId: string;

  @Column({
    type: 'varchar',
    name: 'kakao_id',
    comment: '카카오 ID',
  })
  kakaoId: string;

  @Column({
    type: 'timestamp with time zone',
    name: 'last_login_at',
    comment: '마지막 로그인 일시 (UTC)',
  })
  lastLoginAt: Date;

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.auth, {
    cascade: true,
  })
  refreshTokens: RefreshTokenEntity[];
}
