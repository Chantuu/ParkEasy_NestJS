import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

/**
 * This class is used to validate request body data for creating
 * new reservation.
 */
export class CreateReservationDTO {
  /**
   * This column contains id of the parking spot the reservation is created for,
   * which must be UUID.
   */
  @IsUUID()
  @ApiProperty({
    description:
      'UUID of the desired parking spot for which reservation to be activated.',
    example: 'a6b5cd92-7afe-4d33-933a-e936e692b251',
    pattern: 'UUID',
  })
  parkingSpotId: string;
}
