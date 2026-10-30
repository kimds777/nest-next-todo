import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

type AuthUser = { id: number; email: string };

@UseGuards(JwtAuthGuard)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('completed') completed?: string,
    @Query('searchWord') searchWord?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    return this.todoService.findWithFilter(
      user.id,
      Number(page) || 1,
      Number(limit) || 10,
      completed,
      searchWord,
      sort,
      order,
    );
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body('title') title: string) {
    return this.todoService.create(user.id, title);
  }

  @Delete(':id')
  delete(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.todoService.delete(Number(id), user.id);
  }

  @Patch(':id')
  updateCompleted(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.todoService.updateCompleted(Number(id), user.id);
  }

  @Patch()
  updateTodo(
    @CurrentUser() user: AuthUser,
    @Body() body: { title: string; id: string },
  ) {
    return this.todoService.updateTodo(Number(body.id), user.id, body.title);
  }
}
