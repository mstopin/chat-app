import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  constructor(id?: string, email?: string, password?: string) {
    this.id = id as string;
    this.email = email as string;
    this.password = password as string;
    this.created_at = new Date();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at?: Date | null;

  @DeleteDateColumn()
  deleted_at?: Date | null;
}
