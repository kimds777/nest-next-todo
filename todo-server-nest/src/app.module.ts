import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo/todo.entity';
import { TodoModule } from './todo/todo.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        //const url = config.get<string>('DATABASE_URL');
        //console.log('DB URL:', url?.replace(/:([^:@]+)@/, ':****@'));
        return {
          type: 'postgres',
          url: config.get<string>('DATABASE_URL'),
          ssl: { rejectUnauthorized: false },
          entities: [Todo],
          synchronize: false,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
    }),
    TodoModule,
  ],
})
export class AppModule {}
