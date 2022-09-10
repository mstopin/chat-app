import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { User } from '../../user/entities/User';
import { Channel } from '../../channel/entities/Channel';

@Entity({ name: 'messages' })
export class Message {
  constructor(id?: string, content?: string, sender?: User, channel?: Channel) {
    this.id = id as string;
    this.content = content as string;
    this.sender = sender as User;
    this.channel = channel as Channel;
    this.created_at = new Date();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  sender: User;

  @ManyToOne(() => Channel)
  @JoinColumn({ name: 'channel_id' })
  @Index('channel_id_index')
  channel: Channel;

  @CreateDateColumn()
  @Index('created_at_index')
  created_at: Date;
}
