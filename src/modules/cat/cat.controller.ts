import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiCreateCatSwagger } from 'src/common/swagger/cat/body/create-cat.swagger';
import { ApiUpdateCatSwagger } from 'src/common/swagger/cat/body/update-cat.swagger';
import { HttpStatusMessages } from 'src/constants/http-status-message';
import { PaginationResponse, ResponseCommon } from 'src/interfaces/common';
import { ResponseService } from '../response-common/response-common.service';
import { CatService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';
import { CatQuery } from './interfaces/cat-query.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiQueryCatsSwagger } from 'src/common/swagger/cat/query/query-cats.swagger';

@ApiTags('Cats')
@ApiBearerAuth()
@Controller('cats')
@UseGuards(JwtAuthGuard)
export class CatController {
  constructor(
    private readonly catService: CatService,
    private readonly responseService: ResponseService,
  ) {}

  @Get()
  @ApiQueryCatsSwagger()
  async findAll(@Query() query: CatQuery): Promise<ResponseCommon<{ cats: Cat[] } & PaginationResponse>> {
    try {
      const cats = await this.catService.findAll(query);
      return this.responseService.success(cats);
    } catch {
      return this.responseService.error();
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseCommon<Cat>> {
    try {
      const cat = await this.catService.findOne(id);
      if (cat) {
        return this.responseService.success(cat);
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

  @Post()
  @ApiCreateCatSwagger()
  async create(@Body() catDto: CreateCatDto): Promise<ResponseCommon<Cat>> {
    try {
      const cat = await this.catService.create(catDto);
      return this.responseService.success(cat);
    } catch {
      return this.responseService.error();
    }
  }

  @Put(':id')
  @ApiUpdateCatSwagger()
  async update(@Param('id', ParseIntPipe) id: number, @Body() catDto: UpdateCatDto): Promise<ResponseCommon<Cat>> {
    try {
      const cat = await this.catService.update(id, catDto);
      if (cat) {
        return this.responseService.success(cat);
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

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ResponseCommon<{}>> {
    try {
      const cat = await this.catService.findOne(id);
      if (cat) {
        await this.catService.remove(id);
        return this.responseService.success({});
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
}
