import { ResponseService } from './../response-common/response-common.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/common';
import { PayloadToken } from 'src/interfaces/common';
import { SignInDto } from './dto/sign-in.dto';
import { UserService } from '../user/user.service';
import { HttpStatusMessages } from 'src/constants/http-status-message';
import { User } from '../user/entities/user.entity';
import { STATUS_USER_ENUM } from 'src/interfaces/enum';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly responseService: ResponseService,
    private userService: UserService,
  ) {}

  async signIn(loginUserDto: SignInDto): Promise<{ accessToken: string; refreshToken: string } & User> {
    const user = await this.validateUser(loginUserDto.username, loginUserDto.password);
    console.log(user);

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
      status: user.status,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expiredAccessToken,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expiredRefreshToken,
    });

    return {
      accessToken,
      refreshToken,
      ...user,
    };
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      await this.responseService.error(
        'Tên đăng nhập hoặc mật khẩu không đúng',
        HttpStatus.BAD_REQUEST,
        HttpStatusMessages[HttpStatus.BAD_REQUEST],
      );
    }

    if (user.status === STATUS_USER_ENUM.NOT_ACTIVE) {
      await this.responseService.error(
        'Tài khoản chưa hoạt động',
        HttpStatus.BAD_REQUEST,
        HttpStatusMessages[HttpStatus.BAD_REQUEST],
      );
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      await this.responseService.error(
        'Sai mật khẩu',
        HttpStatus.BAD_REQUEST,
        HttpStatusMessages[HttpStatus.BAD_REQUEST],
      );
    }
  }

  async decodeToken(token: string): Promise<PayloadToken> {
    try {
      const userDecode = await this.jwtService.verify(token, { secret: jwtConstants.secret });
      return userDecode;
    } catch (error) {
      throw await this.responseService.error(
        'test.response.isvalidToken',
        HttpStatus.UNAUTHORIZED,
        HttpStatusMessages[HttpStatus.UNAUTHORIZED],
      );
    }
  }
}
