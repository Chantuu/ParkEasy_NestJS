import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentCard } from './payment-card.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([PaymentCard])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
