import { CreateDateColumn, DeleteDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export abstract class CoreEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'id',
    comment: 'ID',
  })
  id: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_at',
    comment: '생성일시 (UTC)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updated_at',
    comment: '수정일시 (UTC)',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    name: 'deleted_at',
    comment: '삭제일시 (UTC)',
    nullable: true,
  })
  deletedAt: Date | null;
}
