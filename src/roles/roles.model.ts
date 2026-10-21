import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/users.model';
import { UserRoles } from './user-roles.model';

interface RoleCreationAttrs {
  value: string;
  description: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: 'admin', description: 'Role value' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare value: string;

  @ApiProperty({
    example: 'Administrator role',
    description: 'Role description',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare description: string;

  @BelongsToMany(() => User, () => UserRoles)
  declare users: User[];
}
