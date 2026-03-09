import { Body, Controller, Post, Sse, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ParkingService } from './parking.service';
import { SensorDataDTO } from './Dtos/sensor-data.dto';
import { successResponse } from 'src/helper/functions/success-response.function';
import { map } from 'rxjs';

/**
 * This controller is responsible for routing and managing all endpoints related to the parking.
 * Whole controller is protected AuthGuard.
 */
@Controller('api/parking')
export class ParkingController {
  constructor(private _parkingService: ParkingService) {}

  /**
   * This SSE endpoint continously streams data of the currently available parking spot lists.
   * If no parking spot is available at the moment, this endpoint vill stream empty list.
   *
   * @returns List containing data of the available parking spots or empty list
   */
  @Sse('parkingSpots')
  @UseGuards(AuthGuard)
  stream() {
    return this._parkingService.getParkingSpotStream().pipe(
      map((parking) => {
        return { data: parking };
      }),
    );
  }

  /**
   * This endpoint gets current data of all parking spots from the sensor and
   * returns updated parking spots data to the sensor.
   *
   * @param sensorDataDTO - Request body containing all parking spots data from sensor.
   * @returns Updated parking spots data for the sensor.
   */
  @Post('sensor')
  async saveSpotDataFromSensor(@Body() sensorDataDTO: SensorDataDTO) {
    const resultSpotData =
      await this._parkingService.saveSpotDataFromSensor(sensorDataDTO);
    return successResponse('success', resultSpotData);
  }
}
