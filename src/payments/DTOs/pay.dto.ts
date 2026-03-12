import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { ReservationStatus } from 'src/helper/enums/reservation-status.enum';

/**
 * This class is used to validate request body for the pay endpoint.
 */
export class PayDTO {
  /**
   * This is optional property used to specify amount to detuct form user's balance.
   */
  @IsNumber()
  @IsOptional()
  @Min(0.01)
  @ApiProperty({
    description: 'Amount of money to pay for reservation.',
    example: '5',
    minimum: 0.01,
  })
  amount?: number;

  /**
   * This property saves current reservation status to properly detuct money.
   */
  @IsIn([ReservationStatus.CANCELLED, ReservationStatus.COMPLETED])
  @ApiProperty({
    description:
      'Desired reservation status to be set, when performing payment.',
    example: ReservationStatus.COMPLETED,
    enum: [ReservationStatus.CANCELLED, ReservationStatus.COMPLETED],
  })
  reservationStatus: ReservationStatus;
}
