import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { ReservationStatus } from 'src/helper/enums/reservation-status.enum';

/**
 * This class is used to validate request body data for creating
 * new reservation.
 */
export class EditReservationDTO {
  /**
   * This property contains new status of the reservation, which must be
   * CANCELLED or COMPLETED values of Reservation status enum.
   */
  @ApiProperty({
    description: 'Desired Reservation status to be set',
    example: 'COMPLETED',
    enum: [ReservationStatus.CANCELLED, ReservationStatus.COMPLETED],
  })
  @IsIn([ReservationStatus.CANCELLED, ReservationStatus.COMPLETED])
  status: ReservationStatus;

  /**
   * This property contains optional reservation price amount, which
   * must be of number type.
   */
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Desired money amount to be paid for reservation',
    example: 5,
  })
  amount?: number;
}
