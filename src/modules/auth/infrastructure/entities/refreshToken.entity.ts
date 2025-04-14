import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { AuthEntity } from '~/modules/auth/infrastructure/entities/auth.entity';

@Entity({
  name: 'refresh_tokens',
  comment: '리프레시 토큰 테이블',
})
export class RefreshTokenEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'token',
    comment: '토큰 값',
  })
  token: string;

  @Column({
    type: 'timestamp with time zone',
    name: 'expired_at',
    comment: '토큰 만료일시 (UTC)',
  })
  expiredAt: Date;

  @ManyToOne(() => AuthEntity, (auth) => auth.refreshTokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({
    name: 'auth_id',
  })
  auth: AuthEntity;
}
