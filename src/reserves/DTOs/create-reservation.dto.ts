import { IsUUID } from 'class-validator';

export class CreateReservationDTO {
  @IsUUID()
  parkingSpotId: string;
}
