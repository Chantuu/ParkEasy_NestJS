import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ParkingSpotStatus } from 'src/helper/enums/parking-spot-status.enum';

/**
 * This DTO class validates parking spot data related request body.
 */
export class ParkingSpotDto {
  /**
   * This property must contain parking spot name as string.
   */
  @IsString()
  @ApiProperty({
    description: 'Name of the parking spot.',
    example: 'spot-A',
  })
  spotName: string;

  /**
   * This property must contain parking spot status as ParkingSpotStatus enum.
   */
  @ApiProperty({
    description: 'Current status of the parking spot.',
    example: 'FREE',
    enum: ParkingSpotStatus,
  })
  @IsEnum(ParkingSpotStatus)
  status: ParkingSpotStatus;

  /**
   * This property must contain parking spot sensor id as string.
   */
  @IsString()
  @ApiProperty({
    description: 'Individual sensor name of the parking spot.',
    example: 'sensor-01',
  })
  sensorId: string;
}
