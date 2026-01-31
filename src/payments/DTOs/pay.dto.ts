import { IsNumber, Min } from 'class-validator';

//TODO: Implement Reserve logic
export class PayDTO {
  @IsNumber()
  @Min(0.01)
  amount: number;
}
