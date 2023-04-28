import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from '@modules/user/dto/sign-up.dto';
import { UserProfileDto } from '@modules/user/dto/user-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async signUp(signUpDto: SignUpDto): Promise<UserProfileDto> {
    const userByEmail = await this.findByEmail(signUpDto.email);

    if (userByEmail) {
      throw new BadRequestException('User with such email already exists');
    }

    const passwordHash = await bcrypt.hash(signUpDto.password, 10);

    const user = this.userRepository.create({
      name: signUpDto.name,
      email: signUpDto.email,
      passwordHash,
    });

    await this.userRepository.save(user);

    return this.getProfile(user);
  }

  getProfile(user: User): UserProfileDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
