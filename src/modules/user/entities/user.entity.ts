import { Exclude } from 'class-transformer';
import { STATUS_USER_ENUM } from 'src/interfaces/enum';
import { ROLE_ID_ENUM } from 'src/modules/auth/roles/roles.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ default: ROLE_ID_ENUM.USER })
  roleId: ROLE_ID_ENUM;

  @Column({ default: STATUS_USER_ENUM.NOT_ACTIVE })
  status: STATUS_USER_ENUM;
}
