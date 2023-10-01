import {
  IsNumber,
  IsString,
  Min,
  Max,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { IsMaxCurrentYear } from '../decorators/IsMaxCurrentYear.validator';
import type { Type } from '../report.entity';
export class CreateReportDto {
  @IsNumber()
  @Min(0)
  @Max(1000000000)
  price: number;

  @IsString()
  address: string;

  @IsString()
  type: Type;

  @IsNumber()
  @Min(0)
  @Max(12)
  rooms: number;

  @IsNumber()
  @Min(0)
  @Max(10000)
  area: number;

  @IsNumber()
  @Min(1850)
  @IsMaxCurrentYear()
  built: number;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}
