import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { Transactional } from 'typeorm-transactional';

const SORTABLE_FIELDS = ['createdAt', 'title'] as const;

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  // 본인 Todo만 조회 (없거나 남의 것이면 404)
  private async findOwnTodo(id: number, userId: number) {
    const todo = await this.todoRepository.findOneBy({ id, userId });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  create(userId: number, title: string) {
    const todo = this.todoRepository.create({ title, userId });
    return this.todoRepository.save(todo);
  }

  async delete(id: number, userId: number) {
    const result = await this.todoRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Todo not found');
    }
  }

  @Transactional()
  async updateCompleted(id: number, userId: number) {
    const todo = await this.findOwnTodo(id, userId);

    todo.completed = !todo.completed;

    return this.todoRepository.save(todo);
  }

  async findWithFilter(
    userId: number,
    page: number,
    limit: number,
    completed?: string,
    searchWord?: string,
    sort: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    if (!SORTABLE_FIELDS.includes(sort as (typeof SORTABLE_FIELDS)[number])) {
      throw new BadRequestException('정렬할 수 없는 필드입니다.');
    }
    const direction = order === 'ASC' ? 'ASC' : 'DESC';
    const qb = this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.userId = :userId', { userId });

    if (completed) {
      qb.andWhere('todo.completed = :completed', {
        completed: completed === 'true',
      });
    }

    if (searchWord) {
      qb.andWhere('todo.title ILIKE :searchWord', {
        searchWord: `%${searchWord}%`,
      });
    }

    qb.orderBy(`todo.${sort}`, direction)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  @Transactional()
  async updateTodo(id: number, userId: number, title: string) {
    const todo = await this.findOwnTodo(id, userId);

    todo.title = title;

    return this.todoRepository.save(todo);
  }
}
