import { Controller, Get, Post, Delete, Patch, Body, Param } from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Get()
    findAll() {
        return this.todoService.findAll();
    }

    @Post()
    create(@Body('title') title: string) {
        return this.todoService.create(title);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.todoService.delete(Number(id));
    }

    @Patch(':id')
    update(@Param('id') id: string) {
        return this.todoService.update(Number(id));
    }
}
