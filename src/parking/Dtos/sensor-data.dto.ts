import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ParkingSpotDto } from './parking-spot.dto';

export class SensorDataDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @Type(() => ParkingSpotDto)
  parkingSpots: ParkingSpotDto[];
}
