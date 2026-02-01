import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ParkingService } from './parking.service';
import { parkingSpotsNotRegisteredErrorMessage } from 'src/helper/messages/messages.variables';
import { SensorDataDTO } from './Dtos/sensor-data.dto';

@Controller('api/parking')
@UseGuards(AuthGuard)
export class ParkingController {
  constructor(private _parkingService: ParkingService) {}

  @Get('parkingSpots')
  async getAllParkingSpots() {
    const parkingSpotArray = await this._parkingService.getAllParkingSpots();

    if (parkingSpotArray.length > 0) {
      return {
        status: 'success',
        data: parkingSpotArray,
      };
    } else {
      throw new NotFoundException(parkingSpotsNotRegisteredErrorMessage);
    }
  }

  @Post('sensor')
  async saveSpotDataFromSensor(@Body() sensorDataDTO: SensorDataDTO) {
    return await this._parkingService.saveSpotDataFromSensor(sensorDataDTO);
  }
}
