import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * This entity class represents user table in the database.
 */
@Entity()
export class PaymentCard {
  /**
   * Primary key column.
   */
  @PrimaryGeneratedColumn('uuid')
  id: String;

  /**
   * Column containing encrypted card number.
   */
  @Column()
  encryptedCardNumber: string;

  /**
   * Column containing card's expiration month.
   */
  @Column()
  cardExpirationMonth: number;

  /**
   * Column containing card's expiration year.
   */
  @Column()
  cardExpirationYear: number;

  /**
   * Column containing card's owner's full name.
   */
  @Column()
  cardHolderName: string;
}
