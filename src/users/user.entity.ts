import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/report.entity';

/*
  NOTE: Entity is responsible for defining database schema
*/

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User', { ...this });
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User', { ...this });
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User', { ...this });
  }
}
