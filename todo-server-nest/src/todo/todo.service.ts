import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  create(title: string) {
    const todo = this.todoRepository.create({ title });
    return this.todoRepository.save(todo);
  }

  delete(id: number) {
    return this.todoRepository.delete(id);
  }

  @Transactional()
  async updateCompleted(id: number) {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    todo.completed = !todo.completed;

    return this.todoRepository.save(todo);
  }

  async findWithFilter(
    page: number,
    limit: number,
    completed?: string,
    searchWord?: string,
    sort: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    const qb = this.todoRepository.createQueryBuilder('todo');

    if (completed) {
      qb.andWhere('todo.completed = :completed', {
        completed: completed === 'true',
      });
    }

    if (searchWord) {
      qb.andWhere('todo.title LIKE :searchWord', {
        searchWord: `%${searchWord}%`,
      });
    }

    // 정렬
    qb.orderBy(`todo.${sort}`, order);

    // 페이지네이션
    const skip = (page - 1) * limit;

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  @Transactional()
  async updateTodo(id: number, title: string) {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new Error('Todo not found');
    }

    todo.title = title;

    return this.todoRepository.save(todo);
  }
}
