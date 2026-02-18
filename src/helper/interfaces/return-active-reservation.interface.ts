import { ReservationStatus } from '../enums/reservation-status.enum';

/**
 * This interface represents formatted Reservation object used for defining
 * it's data structure to be used for sse stream output.
 */
export interface ReturnFormattedReservationInterface {
  id: string;
  userId: string;
  parkingSpotName: string;
  startTime: Date;
  status: ReservationStatus;
  amount?: number;
}
