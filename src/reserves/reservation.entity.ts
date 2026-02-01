import { ParkingSpot } from 'src/parking/parking-spot.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'datetime', nullable: false })
  startTime: Date;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => ParkingSpot, (parkingSpot) => parkingSpot.reservations)
  parkingSpot: ParkingSpot;
}
