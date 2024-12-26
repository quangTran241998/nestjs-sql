import { ResponseService } from './../response-common/response-common.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationResponse } from 'src/interfaces/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQuery } from './interfaces/user-query.interface';
import * as bcrypt from 'bcrypt';
import { HttpStatusMessages } from 'src/constants/http-status-message';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
    private readonly responseService: ResponseService,
  ) {}

  async findAll(
    filter: UserQuery,
    sortBy: string = 'id',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ users: User[] } & PaginationResponse> {
    const { page: pageQuery, size: sizeQuery } = filter;
    const page = Number(pageQuery) || 1;
    const size = Number(sizeQuery) || 10;
    const queryBuilder = this.UserRepository.createQueryBuilder('User');

    if (filter.username) {
      queryBuilder.andWhere('user.username LIKE :username', { name: `%${filter.username}%` });
    }
    queryBuilder.orderBy(`user.${sortBy}`, sortOrder);

    queryBuilder.skip((page - 1) * size).take(size);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { users: data, total, page, size };
  }

  async findOne(id: number): Promise<User> {
    return this.UserRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.UserRepository.findOneBy({ username });
  }

  async findOneEmail(email: string): Promise<User> {
    const user = await this.UserRepository.findOneBy({ email });
    return user;
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const { username, email, password } = userDto;
    const isCheckUserExit = await this.findOneByUsername(username);
    const isCheckEmailExit = await this.findOneEmail(email);

    if (isCheckUserExit) {
      throw await this.responseService.error(
        `Tài khoản đã tồn tại`,
        HttpStatus.BAD_REQUEST,
        HttpStatusMessages[HttpStatus.BAD_REQUEST],
      );
    } else if (isCheckEmailExit) {
      throw await this.responseService.error(
        `Email đã tồn tại`,
        HttpStatus.BAD_REQUEST,
        HttpStatusMessages[HttpStatus.BAD_REQUEST],
      );
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await this.UserRepository.save({ ...userDto, password: hashedPassword });
      delete user.password;
      return user;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { password } = updateUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await this.UserRepository.update(id, { ...updateUserDto, password: hashedPassword });
    const user = await this.UserRepository.findOneBy({ id });
    delete user.password;
    return user;
  }

  async delete(id: number): Promise<void> {
    await this.UserRepository.delete(id);
  }
}
