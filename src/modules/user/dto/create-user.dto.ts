import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-z]).{8,10}$/, {
    message:
      'Password must be 8-10 characters long, include an uppercase letter, a special character, and a lowercase letter',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
