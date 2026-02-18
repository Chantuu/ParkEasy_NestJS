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
  @IsIn([ReservationStatus.CANCELLED, ReservationStatus.COMPLETED])
  status: ReservationStatus;

  /**
   * This property contains optional reservation price amount, which
   * must be of number type.
   */
  @IsNumber()
  @IsOptional()
  amount?: number;
}
