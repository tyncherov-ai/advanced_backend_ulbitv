import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from '../roles/roles.model';

export interface JwtPayload {
  id: number;
  email: string;
  roles: Role[];
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    // Header format: "Authorization: Bearer <token>"
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('User is not authorized');
    }

    try {
      // Checks the signature and expiry, returns the payload from generateToken
      const user = this.jwtService.verify<JwtPayload>(token);
      req['user'] = user;
      return true;
    } catch {
      throw new UnauthorizedException('User is not authorized');
    }
  }
}
