import { Expose } from 'class-transformer';

/*
  This is a Data Transfer Object (DTO) class. It is used to filter the data that is sent to client.
*/

export class userDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
