import { Injectable } from '@nestjs/common';
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

    findAll() {
        return this.todoRepository.find();
    }

    create(title: string) {
        const todo = this.todoRepository.create({ title });
        return this.todoRepository.save(todo);
    }

    delete(id: number) {
        return this.todoRepository.delete(id);
    }

    @Transactional()
    async update(id: number) {
        const todo = await this.todoRepository.findOneBy({ id });
        if (!todo) {
            throw new Error('Todo not found');
        }

        todo.completed = !todo.completed;

        return this.todoRepository.save(todo);
    }
}
