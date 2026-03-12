import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ParkingSpotDto } from './parking-spot.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * This DTO class is used to validate ParkingSpotDTO list.
 */
export class SensorDataDTO {
  /**
   * This property must contain list of exactly 4 ParkingSpotDTO objects.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @Type(() => ParkingSpotDto)
  @ApiProperty({
    type: () => [ParkingSpotDto],
  })
  parkingSpots: ParkingSpotDto[];
}
