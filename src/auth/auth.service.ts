import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async register(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (user) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 12);
    const newUser = await this.userService.createUser({
      ...userDto,
      password: hashedPassword,
    });

    return this.generateToken(newUser);
  }

  private generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);

    const passwordEquals =
      !!user && (await bcrypt.compare(userDto.password, user.password));

    if (!user || !passwordEquals) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }
}
