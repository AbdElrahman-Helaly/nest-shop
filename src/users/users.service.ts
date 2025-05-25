import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './users.entity';
import { CreateUserDto } from './Dtos/Createuser.dto';
import { UserDto } from './Dtos/user.dto';
import { UpdateUserDto } from './Dtos/updateuser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.repo.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.repo.create(createUserDto);

    return await this.repo.save(user);
  }

  async findall() {
    const users = await this.repo.find({
      where: { isActive: true },
    });

    return users;
  }

  async findone(id: string) {
    const user = await this.repo.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.repo.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.repo.remove(user);
  }

  async update(id: string, updateuserdto: UpdateUserDto) {
    const user = await this.repo.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateuserdto);

    return this.repo.save(user);
  }

  async findByEmail(email: string) {
    return await this.repo.findOne({ where: { email } });
  }
}
