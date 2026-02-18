import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { Equal, Or, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import {
  activeReservationAlreadyExitsErrorMessage,
  activeReservationNotFoundErrorMessage,
  envVariableNotDefinedErrorMessage,
  parkingSpotIdErrorMessage,
  parkingSpotReservedErrorMessage,
  parkingSpotTakenErrorMessage,
  reservationNotFoundErroMessage,
} from 'src/helper/messages/messages.variables';
import { CreateReservationDTO } from './DTOs/create-reservation.dto';
import { ParkingService } from 'src/parking/parking.service';
import { ReservationStatus } from 'src/helper/enums/reservation-status.enum';
import { EditReservationDTO } from './DTOs/edit-reservation.dto';
import { ParkingSpotStatus } from 'src/helper/enums/parking-spot-status.enum';
import { ConfigService } from '@nestjs/config';
import { BehaviorSubject } from 'rxjs';
import { ReturnFormattedReservationInterface } from 'src/helper/interfaces/return-active-reservation.interface';

/**
 * This service is used to control reservation related logic.
 */
@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private _reservationRepository: Repository<Reservation>,
    private _parkingService: ParkingService,
    private _configService: ConfigService,
  ) {}

  /**
   * BehaviorSubject used to stream active reservation data or null
   */
  private _activeReservationSubject =
    new BehaviorSubject<ReturnFormattedReservationInterface | null>(null);

  /**
   * This method formats reservation data for sending it as response data.
   *
   * @param reservation - Desired reservation entity to be formatted.
   * @param currentUser - User currently signed in.
   * @returns Formatted reservation data
   */
  private formatReservationData(reservation: Reservation, currentUser: User) {
    return {
      id: reservation.id,
      userId: currentUser.id,
      parkingSpotName: reservation.parkingSpot.spotName,
      startTime: reservation.startTime,
      status: reservation.status,
      ...(reservation.amount ? { amount: reservation.amount } : {}),
    };
  }

  /** This method returns observable of the currently active reservation
   * for the current user, if it has already activated reservation.
   *
   * @param currentUser - User currently signed in.
   * @returns Promise containing observable with the type formatted active reservation data or null
   */
  async getCurrentActiveReservation(currentUser: User) {
    const activeReservation = await this._reservationRepository.findOne({
      where: [{ user: currentUser, status: ReservationStatus.ACTIVE }],
      relations: { parkingSpot: true },
    });

    if (activeReservation) {
      const formattedReservation = this.formatReservationData(
        activeReservation,
        currentUser,
      );
      this._activeReservationSubject.next(formattedReservation);
    } else {
      this._activeReservationSubject.next(null);
    }

    return this._activeReservationSubject.asObservable();
  }

  /**
   * This method calculates payment price for the current users' active reservation based
   * on the elapsed time.
   *
   * @param currentUser - User currently signed in.
   * @returns Promise containing properly formatted payment data
   * @throws NotFoundException if active reservation is not found for current user
   */
  async calculateReservationPrice(currentUser: User) {
    const activeReservation = await this._reservationRepository.findOne({
      where: [{ user: currentUser, status: ReservationStatus.ACTIVE }],
      relations: { parkingSpot: true },
    });

    // If current user has active reservation
    if (activeReservation) {
      const ratePerMinute = this._configService.get<number>(
        'ACTIVE_RESERVATION_RATE_PER_MINUTE',
      );
      const currentDate = new Date();

      // If ACTIVE_RESERVATION_RATE_PER_MINUTE env variable is not defined
      if (!ratePerMinute) {
        console.error(
          'Env variable ACTIVE_RESERVATION_RATE_PER_MINUTE is not defined!',
        );
        throw new InternalServerErrorException(
          envVariableNotDefinedErrorMessage,
        );
      }

      // Calculate elapsed time in milleseconds
      const diffMilleseconds =
        currentDate.getTime() - activeReservation.startTime.getTime();

      const secondsElapsed = Math.max(0, Math.floor(diffMilleseconds / 1000));
      const minutesElapsed = secondsElapsed / 60;

      const amountToPay = minutesElapsed * ratePerMinute;
      // Format to 2 decimal places
      const finalPrice = parseFloat(amountToPay.toFixed(2)) + 1;

      return {
        startTime: activeReservation.startTime.toISOString(),
        endTime: currentDate.toISOString(),
        amountToPay: finalPrice,
        currency: 'GEL',
      };
    } else {
      throw new NotFoundException(activeReservationNotFoundErrorMessage);
    }
  }

  /**
   * This method returns all inactive reservations associated to current user,
   * if they exist.
   *
   * @param currentUser - User currently signed in.
   * @returns Promise containing formatted reservation data list
   */
  async getInactiveReservation(currentUser: User) {
    const reservationEntityList = await this._reservationRepository.find({
      where: {
        user: currentUser,
        status: Or(
          Equal(ReservationStatus.CANCELLED),
          Equal(ReservationStatus.COMPLETED),
        ),
      },
      relations: { parkingSpot: true },
    });

    // If reservations exist for current user
    if (reservationEntityList.length) {
      return reservationEntityList
        .map((reservationEntity) =>
          this.formatReservationData(reservationEntity, currentUser),
        )
        .reverse();
    } else {
      throw new BadRequestException(reservationNotFoundErroMessage);
    }
  }

  /**
   * This method creates new active reservation for current user, if
   * it does not already have active reservation.
   *
   * @param currentUser - User currently signed in.
   * @param createReservationDTO - Validated request body containing reservation creation data.
   * @returns Promise containing newly created active reservation data
   * @throws BadRequestException when active reservation already exists
   * @throws BadRequestException when parking spot is already taken
   * @throws BadRequestException when parking spot with supplied id does not exist
   */
  async createReservation(
    currentUser: User,
    createReservationDTO: CreateReservationDTO,
  ) {
    // Check for active reservation existence for user
    const isActiveReservation = await this._reservationRepository.findOne({
      where: { user: currentUser, status: ReservationStatus.ACTIVE },
    });
    // Check if parking spot exists with that id
    const currentParkingSpot = await this._parkingService.getParkingSpotById(
      createReservationDTO.parkingSpotId,
    );

    const parkingSpotHasActiveResevation =
      currentParkingSpot?.status === ParkingSpotStatus.RESERVED;
    const parkingSpotIsFree =
      currentParkingSpot?.status === ParkingSpotStatus.FREE;

    // If current user does not have active reservation, while parking spot id is correct and
    // that parking spot does not have active reservation and is free
    if (
      !isActiveReservation &&
      currentParkingSpot &&
      !parkingSpotHasActiveResevation &&
      parkingSpotIsFree
    ) {
      // Update current parking spot to be reserved
      this._parkingService.updateParkingSpotStatus(
        currentParkingSpot,
        ParkingSpotStatus.RESERVED,
      );

      const newReservation = this._reservationRepository.create({
        user: currentUser,
        parkingSpot: currentParkingSpot,
        startTime: new Date(),
      });

      await this._reservationRepository.save(newReservation);

      const formattedNewReservation = this.formatReservationData(
        newReservation,
        currentUser,
      );

      this._activeReservationSubject.next(formattedNewReservation);

      return formattedNewReservation;
    }
    // If current user does not have active reservation, while parking spot id is correct and
    // that parking spot does not have active reservation, but is taken
    else if (
      !isActiveReservation &&
      currentParkingSpot &&
      !parkingSpotHasActiveResevation &&
      !parkingSpotIsFree
    ) {
      throw new BadRequestException(parkingSpotTakenErrorMessage);
    }
    // If current user does not have active reservation, while parking spot id is correct, but
    // that parking spot has active reservation
    else if (
      !isActiveReservation &&
      currentParkingSpot &&
      parkingSpotHasActiveResevation
    ) {
      throw new BadRequestException(parkingSpotReservedErrorMessage);
    }
    // If parking spot with that id does not exist
    else if (!currentParkingSpot) {
      throw new BadRequestException(parkingSpotIdErrorMessage);
    } else {
      throw new BadRequestException(activeReservationAlreadyExitsErrorMessage);
    }
  }

  /**
   * This method edits current user's active reservation to mark it's cancellation
   * or completion, only when it has active reservation.
   *
   * @param currentUser - User currently signed in.
   * @param editReservationDTO - Validated request body containing reservation edit data.
   * @returns Promise containing edited reservation data
   * @throws NotFoundException when activer reservation for current user is not found
   */
  async editActiveReservation(
    currentUser: User,
    editReservationDTO: EditReservationDTO,
  ) {
    // Check for active reservation existence
    const currentActiveReservation = await this._reservationRepository.findOne({
      where: [
        { user: { id: currentUser.id }, status: ReservationStatus.ACTIVE },
      ],
      relations: { parkingSpot: true },
    });

    // If active reservation exists
    if (currentActiveReservation) {
      currentActiveReservation.status = editReservationDTO.status;
      const currentAmount = editReservationDTO.amount;

      if (currentAmount) {
        currentActiveReservation.amount = currentAmount;
      }

      await this._parkingService.updateParkingSpotStatus(
        currentActiveReservation.parkingSpot,
        ParkingSpotStatus.FREE,
      );

      await this._reservationRepository.save(currentActiveReservation);
      this._activeReservationSubject.next(null);

      return this.formatReservationData(currentActiveReservation, currentUser);
    } else {
      throw new NotFoundException(activeReservationNotFoundErrorMessage);
    }
  }
}
