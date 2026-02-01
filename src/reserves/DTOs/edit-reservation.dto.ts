import { IsIn } from 'class-validator';
import { ReservationStatus } from 'src/helper/enums/reservation-status.enum';

export class EditReservationDTO {
  @IsIn([ReservationStatus.CANCELLED, ReservationStatus.COMPLETED])
  status: ReservationStatus;
}
