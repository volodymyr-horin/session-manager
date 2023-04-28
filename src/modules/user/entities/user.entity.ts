import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@common/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;
}
