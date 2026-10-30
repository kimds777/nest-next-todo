import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), AuthModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
