import { IsEnum, IsString } from 'class-validator';
import { ParkingSpotStatus } from 'src/helper/enums/parking-spot-status.enum';

export class ParkingSpotDto {
  @IsString()
  spotName: string;

  @IsEnum(ParkingSpotStatus)
  status: ParkingSpotStatus;

  @IsString()
  sensorId: string;
}
