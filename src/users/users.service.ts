import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const role = await this.rolesService.getRoleByValue('USER');

    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.create(dto);
    await user.$set('roles', [role.id]);
    user.roles = [role];

    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });

    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.rolesService.getRoleByValue(dto.value);

    if (role && user) {
      await user.$add('role', role.id);
      return await this.userRepository.findByPk(user.id, {
        include: { all: true },
      });
    }

    throw new HttpException('User or role not found', HttpStatus.NOT_FOUND);
  }

  async banUser(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.banned = true;
    user.bannedReason = dto.bannedReason;
    await user.save();

    return user;
  }
}
