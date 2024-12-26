import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatQuery } from './interfaces/cat-query.interface';
import { PaginationResponse } from 'src/interfaces/common';
import { UpdateCatDto } from './dto/update-cat.dto';

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
  ) {}

  async findAll(
    filter: CatQuery,
    sortBy: string = 'id',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ cats: Cat[] } & PaginationResponse> {
    const { page: pageQuery, size: sizeQuery } = filter;
    const page = Number(pageQuery) || 1;
    const size = Number(sizeQuery) || 10;
    const queryBuilder = this.catRepository.createQueryBuilder('cat');

    if (filter.name) {
      queryBuilder.andWhere('cat.name LIKE :name', { name: `%${filter.name}%` });
    }
    if (filter.breed) {
      queryBuilder.andWhere('cat.breed = :breed', { breed: filter.breed });
    }

    queryBuilder.orderBy(`cat.${sortBy}`, sortOrder);

    queryBuilder.skip((page - 1) * size).take(size);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { cats: data, total, page, size };
  }

  async findOne(id: number): Promise<Cat> {
    return this.catRepository.findOneBy({ id });
  }

  async create(cat: CreateCatDto): Promise<Cat> {
    return this.catRepository.save(cat);
  }

  async update(id: number, cat: UpdateCatDto): Promise<Cat> {
    await this.catRepository.update(id, cat);
    return this.catRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.catRepository.delete(id);
  }
}
