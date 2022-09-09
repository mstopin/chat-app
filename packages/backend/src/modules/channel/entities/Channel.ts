import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from '../../user/entities/User';

@Entity({ name: 'channels' })
export class Channel {
  constructor(
    id?: string,
    owner?: User,
    name?: string,
    password?: string | null,
    members?: User[]
  ) {
    this.id = id as string;
    this.owner = owner as User;
    this.name = name as string;
    this.password = password as string | null;
    this.members = members as User[];
    this.created_at = new Date();
    this.updated_at = null;
    this.deleted_at = null;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'channel_members',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'channel_id',
      referencedColumnName: 'id',
    },
  })
  members: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date | null;

  @DeleteDateColumn()
  deleted_at: Date | null;
}
