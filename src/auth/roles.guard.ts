import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles-auth.decorator';
import { JwtPayload } from './jwt-auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Role values from @Roles('ADMIN'), e.g. ['ADMIN']
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();

    // Header format: "Authorization: Bearer <token>"
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('User is not authorized');
    }

    let user: JwtPayload;
    try {
      user = this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('User is not authorized');
    }
    req['user'] = user;

    // Roles in the token are objects ({ id, value, ... }), compare by value
    const hasRole = user.roles.some((role) =>
      requiredRoles.includes(role.value),
    );
    if (!hasRole) {
      throw new ForbiddenException('User has no required roles');
    }
    return true;
  }
}
