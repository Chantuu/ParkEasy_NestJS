import { ApiProperty } from '@nestjs/swagger';
import { IsCreditCard, IsString, IsNumber, Min, Max } from 'class-validator';

/**
 * This class is used to validate payment card request body for it's registration.
 */
export class AddPaymentCardDTO {
  /**
   * This property must be valid credit card number of type string.
   */
  @IsCreditCard()
  @ApiProperty({
    description: 'Payment card number.',
    example: '4444111122223333',
    pattern: 'Luhn algorithm.',
  })
  cardNumber: string;

  /**
   * This property must be full card holder name of type string.
   */
  @IsString()
  @ApiProperty({
    description: 'Full card holder name.',
    example: 'Giorgi TChanturia',
  })
  cardHolderName: string;

  /**
   * This property must contain correct expiration month number of the card.
   */
  @IsNumber()
  @Min(1)
  @Max(12)
  @ApiProperty({
    description: 'Expiration month number of the payment card.',
    example: '10',
    pattern: '2 digit number.',
  })
  cardExpirationMonth: number;

  /**
   * This property must contain correct expiration year number of the card.
   */
  @IsNumber()
  @Min(new Date().getFullYear(), {
    message: 'Expiration year must be the current year or later',
  })
  @ApiProperty({
    description: 'Expiration year number of the payment card.',
    example: '2029',
    pattern: '4 digit number.',
  })
  cardExpirationYear: number;

  /**
   * This property must contain correct ccv number of the card.
   */
  @IsNumber()
  @Min(100)
  @Max(999)
  @ApiProperty({
    description: 'CCV number of the payment card.',
    example: '431',
    pattern: '3 digit number.',
    minimum: 100,
    maximum: 999,
  })
  ccv: number;
}
