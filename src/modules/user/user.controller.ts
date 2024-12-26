import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiUpdateUserInfoSwagger } from 'src/common/swagger/user/body/update-user.swagger';
import { PaginationResponse, ResponseCommon } from 'src/interfaces/common';
import { ResponseService } from '../response-common/response-common.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserQuery } from './interfaces/user-query.interface';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { ROLE_ID_ENUM } from '../auth/roles/roles.enum';
import { HttpStatusMessages } from 'src/constants/http-status-message';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
@Roles(ROLE_ID_ENUM.ADMIN)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponseService,
  ) {}

  @Get()
  async findAll(@Query() query: UserQuery): Promise<ResponseCommon<{ users: User[] } & PaginationResponse>> {
    try {
      const cats = await this.userService.findAll(query);
      return this.responseService.success(cats);
    } catch (error) {
      return this.responseService.error(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseCommon<User>> {
    try {
      const user = await this.userService.findOne(id);
      if (user) {
        return this.responseService.success(user);
      } else {
        return this.responseService.error(
          `Not found id ${id}`,
          HttpStatus.NOT_FOUND,
          HttpStatusMessages[HttpStatus.NOT_FOUND],
        );
      }
    } catch (error) {
      return error;
    }
  }

  @Put(':id')
  @ApiUpdateUserInfoSwagger()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseCommon<User>> {
    try {
      const isUser = await this.userService.findOne(id);
      if (isUser) {
        const user = await this.userService.update(id, updateUserDto);
        return this.responseService.success(user);
      } else {
        return this.responseService.error(
          `Not found id ${id}`,
          HttpStatus.NOT_FOUND,
          HttpStatusMessages[HttpStatus.NOT_FOUND],
        );
      }
    } catch (error) {
      return this.responseService.error(error);
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ResponseCommon<{}>> {
    try {
      const isUser = await this.userService.findOne(id);
      console.log(isUser);

      if (isUser) {
        await this.userService.delete(id);
        return this.responseService.success({});
      } else {
        return this.responseService.error(
          `Not found id ${id}`,
          HttpStatus.NOT_FOUND,
          HttpStatusMessages[HttpStatus.NOT_FOUND],
        );
      }
    } catch (error) {
      return this.responseService.error(error);
    }
  }
}
