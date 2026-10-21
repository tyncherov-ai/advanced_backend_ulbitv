import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post()
  createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get('/:value')
  getRoleByValue(@Param('value') value: string) {
    return this.rolesService.getRoleByValue(value);
  }
}
