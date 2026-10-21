import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @ApiProperty({ example: 'hashed-password', description: 'User password' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @ApiProperty({ example: false, description: 'User banned status' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare banned: boolean;

  @ApiProperty({ example: null, description: 'Reason for user ban' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare bannedReason: string;

  @BelongsToMany(() => Role, () => UserRoles)
  declare roles: Role[];
}
