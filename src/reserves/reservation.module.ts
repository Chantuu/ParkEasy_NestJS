import { Module } from '@nestjs/common';
import { ReservesController } from './reservation.controller';
import { ReservesService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation])],
  controllers: [ReservesController],
  providers: [ReservesService],
})
export class ReservesModule {}
