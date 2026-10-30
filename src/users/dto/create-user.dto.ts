import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email!: string;

  @ApiProperty({ example: 'user-password', description: 'User password' })
  @IsString({ message: 'Password must be a string' })
  @Length(4, 16, { message: 'Password must be between 4 and 16 characters' })
  readonly password!: string;
}
