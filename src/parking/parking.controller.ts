import { Body, Controller, Post, Sse, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ParkingService } from './parking.service';
import { SensorDataDTO } from './Dtos/sensor-data.dto';
import { successResponse } from 'src/helper/functions/success-response.function';
import { map } from 'rxjs';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

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
  @ApiOperation({
    summary: 'Get all parking spot data.',
    description:
      'Get currently available parking spot data list. Please note, that Swagger does not support SSE' +
      'and you have to test this endpoint manually.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved full parking spot data.',
    schema: {
      example: [
        {
          id: '2e089c6d-6520-407a-ae49-29d8fc4adf10',
          spotName: 'spot-A',
          status: 'TAKEN',
          sensorId: 'sensor-01',
        },
        {
          id: '2e089c6d-6520-407a-ae49-29d8fc4adf10',
          spotName: 'spot-B',
          status: 'TAKEN',
          sensorId: 'sensor-02',
        },
        {
          id: '2e089c6d-6520-407a-ae49-29d8fc4adf10',
          spotName: 'spot-C',
          status: 'TAKEN',
          sensorId: 'sensor-03',
        },
        {
          id: '2e089c6d-6520-407a-ae49-29d8fc4adf10',
          spotName: 'spot-D',
          status: 'TAKEN',
          sensorId: 'sensor-04',
        },
      ],
    },
  })
  @ApiCookieAuth()
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
  @ApiOperation({
    summary: 'Post parking spot data from sensor.',
    description:
      'Save new parking spot data from the sensor and return updated parking spot data.',
  })
  @ApiResponse({
    status: 201,
    description: 'Parking spot data successfully updated.',
    schema: {
      example: {
        status: 'success',
        data: [
          {
            id: '2e089c6d-6520-407a-ae49-29d8fc4adf10',
            spotName: 'spot-A',
            status: 'TAKEN',
            sensorId: 'sensor-01',
          },
          {
            id: '2e089c6d-6520-407a-ae49-29d8fc4adf10',
            spotName: 'spot-B',
            status: 'TAKEN',
            sensorId: 'sensor-02',
          },
          {
            id: '2e089c6d-6520-407a-ae49-29d8fc4adf10',
            spotName: 'spot-C',
            status: 'TAKEN',
            sensorId: 'sensor-03',
          },
          {
            id: '2e089c6d-6520-407a-ae49-29d8fc4adf10',
            spotName: 'spot-D',
            status: 'TAKEN',
            sensorId: 'sensor-04',
          },
        ],
      },
    },
  })
  @ApiBadRequestResponse({
    description: '',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: ['parkingSpots must contain at least 4 elements'],
          error: 'Bad Request',
        },
      },
    },
  })
  @Post('sensor')
  async saveSpotDataFromSensor(@Body() sensorDataDTO: SensorDataDTO) {
    const resultSpotData =
      await this._parkingService.saveSpotDataFromSensor(sensorDataDTO);
    return successResponse('success', resultSpotData);
  }
}
