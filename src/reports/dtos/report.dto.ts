import { Expose, Transform } from 'class-transformer';
import { Type } from '../report.entity';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  address: string;

  @Expose()
  type: Type;

  @Expose()
  rooms: number;

  @Expose()
  area: number;

  @Expose()
  price: number;

  @Expose()
  built: number;

  @Expose()
  longitude: number;

  @Expose()
  latitude: number;

  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: number;
}
