import { Controller, Get, Post, Delete, Patch, Body, Param, Query } from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Get()
    findAll(@Query('completed') completed?: string, @Query('searchWord') searchWord?: string) {
        return this.todoService.findWithFilter(completed, searchWord);
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
