import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext, addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const dataSource = app.get(DataSource);
  addTransactionalDataSource(dataSource);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
