import { EncryptionModule } from './../encryption/encryption.module';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentCard } from './payment-card.entity';
import { ReservationModule } from 'src/reservation/reservation.module';

@Module({
  imports: [
    EncryptionModule,
    AuthModule,
    TypeOrmModule.forFeature([PaymentCard]),
    ReservationModule,
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
