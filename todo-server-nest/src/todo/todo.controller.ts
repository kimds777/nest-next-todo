import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('completed') completed?: string,
    @Query('searchWord') searchWord?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    return this.todoService.findWithFilter(
      Number(page),
      Number(limit),
      completed,
      searchWord,
      sort,
      order,
    );
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
  updateCompleted(@Param('id') id: string) {
    return this.todoService.updateCompleted(Number(id));
  }

  @Patch()
  updateTodo(@Body() body: { title: string; id: string }) {
    return this.todoService.updateTodo(Number(body.id), body.title);
  }
}
