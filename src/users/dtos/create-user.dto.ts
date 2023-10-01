import { IsEmail, IsNotEmpty } from 'class-validator';

/*
  This is a Data Transfer Object (DTO) class. It is used to validate the data that is sent to the server.
  It is used in the controller to validate the data that is sent to the server.
*/

export class createUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
