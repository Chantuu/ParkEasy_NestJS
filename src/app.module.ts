import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'main.db',
      entities: [],
      synchronize: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
