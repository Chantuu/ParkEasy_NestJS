import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSpot } from './parking-spot.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ParkingSpot])],
  providers: [ParkingService],
  controllers: [ParkingController],
  exports: [ParkingService],
})
export class ParkingModule {}
