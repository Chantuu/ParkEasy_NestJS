import { IsCreditCard, IsString, IsNumber, Min, Max } from 'class-validator';

export class AddPaymentCardDTO {
  @IsCreditCard()
  cardNumber: string;

  @IsString()
  cardHolderName: string;

  @IsNumber()
  @Min(1)
  @Max(12)
  cardExpirationMonth: number;

  @IsNumber()
  @Min(new Date().getFullYear(), {
    message: 'Expiration year must be the current year or later',
  })
  cardExpirationYear: number;

  @IsNumber()
  @Min(3)
  @Max(3)
  ccv: number;
}
