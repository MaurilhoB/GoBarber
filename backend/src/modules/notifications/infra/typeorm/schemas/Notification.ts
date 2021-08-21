import {
  Column,
  Entity,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectID,
} from 'typeorm';

@Entity()
export default class Notification {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  recipient_id: string;

  @Column()
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
