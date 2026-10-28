import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('이미 가입된 이메일입니다.');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepo.save({
      email: dto.email,
      password: hashed,
    });
    return { id: user.id, email: user.email };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const payload = { sub: user.id, email: user.email };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
