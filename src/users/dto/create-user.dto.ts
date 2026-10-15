import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  readonly email!: string;

  @ApiProperty({ example: 'user-password', description: 'User password' })
  readonly password!: string;
}
