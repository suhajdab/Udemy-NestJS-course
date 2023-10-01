import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

export enum Type {
  apartment = 'apartment',
  house = 'house',
  office = 'office',
}

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  address: string;

  @Column()
  type: Type;

  @Column()
  rooms: number;

  @Column()
  area: number;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
