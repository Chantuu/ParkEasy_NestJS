import { SensorDataDTO } from './Dtos/sensor-data.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParkingSpot } from './parking-spot.entity';
import { Repository } from 'typeorm';
import { ParkingSpotStatus } from 'src/helper/enums/parking-spot-status.enum';
import { BehaviorSubject } from 'rxjs';
import { ReservationStatus } from 'src/helper/enums/reservation-status.enum';

/**
 * This service is used to handle main logic related to parking spots.
 */
@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(ParkingSpot)
    private _parkingSpotRepository: Repository<ParkingSpot>,
  ) {}

  /**
   * BehaviorSubject used to stream list of the ParkingSpot entities.
   */
  private _parkingSubject = new BehaviorSubject<ParkingSpot[]>([]);

  /**
   * This helper method is used to emit currently available parking spot data
   * for sending it.
   */
  private async emitParkingSpot() {
    const updatedParkingSpots = await this.getAllParkingSpots();
    this._parkingSubject.next(updatedParkingSpots);
  }

  /**
   * This special method is called on module initialization and is used
   * to preload currently available parking spot data list to the client.
   */
  async onModuleInit() {
    // Load existing parking data at startup
    const latest = await this.getAllParkingSpots();
    this._parkingSubject.next(latest);
  }

  /**
   * This method tries to find one parking spot based on the specified id
   * and try to return it.
   *
   * @param id - Id string of the desired parking spot.
   * @returns Promise containing found ParkingSpot Entity or null.
   */
  getParkingSpotById(id: string) {
    return this._parkingSpotRepository.findOne({
      where: { id: id },
      relations: { reservations: true },
    });
  }

  /**
   * This method tries to return all available parking spots.
   *
   * @returns Promise containing list of ParkingSlot Entities.
   */
  getAllParkingSpots() {
    return this._parkingSpotRepository.find({
      relations: { reservations: true },
    });
  }

  /**
   * This method returns BehaviorSubject containing list of ParkingSpot entites
   * as a Observabel to be sent by the SSE endpoint.
   *
   * @returns
   */
  getParkingSpotStream() {
    return this._parkingSubject.asObservable();
  }

  /**
   * This method gets data of all parking spots data and updates those parking spot status
   * and data accordingly. After that it returns updated data as a response to the sensor.
   *
   * @param sensorDataDTO - Validated request body of all parking spots.
   * @returns Updated data list of all parking spots.
   */
  async saveSpotDataFromSensor(sensorDataDTO: SensorDataDTO) {
    // Get existing parking spot entities to update
    const existingSpots = await this.getAllParkingSpots();

    // Map them for fast access
    const existingSpotsMap = new Map(
      existingSpots.map((spot) => [spot.sensorId, spot]),
    );

    const spotsToPersist = sensorDataDTO.parkingSpots.map((incomingSpotDTO) => {
      // Get corresponding existing parking spot if it exists.
      const persistedSpot = existingSpotsMap.get(incomingSpotDTO.sensorId);

      // If this parking spot entity exists
      if (persistedSpot) {
        const foundActiveReservation = persistedSpot.reservations.find(
          (reservation) => {
            return reservation.status === ReservationStatus.ACTIVE;
          },
        );

        // Lock RESERVED status if current parking spot is still resserved and reservation for it exists
        // and is active.
        const isLocked =
          persistedSpot.status === ParkingSpotStatus.RESERVED &&
          foundActiveReservation &&
          foundActiveReservation.status === ReservationStatus.ACTIVE;

        // Return changed parking spot data. If isLocked variable is true, sstatus property stays same
        return {
          ...persistedSpot,
          ...incomingSpotDTO,
          status: isLocked ? persistedSpot.status : incomingSpotDTO.status,
        };
      }

      // Return new parking spot data, if existing one does not exist
      return incomingSpotDTO;
    });

    const formattedResponseData = (
      await this._parkingSpotRepository.save(spotsToPersist)
    ).map((updatedSpot) => ({
      id: updatedSpot.id,
      spotName: updatedSpot.spotName,
      status: updatedSpot.status,
      sensorId: updatedSpot.sensorId,
    }));

    // Emit updated data to the BehaviorSubject
    await this.emitParkingSpot();

    return formattedResponseData;
  }

  /**
   * This method is used to update current status of the parking spot.
   *
   * @param parkingSpot - Desired parking spot to be updated.
   * @param parkingStatus - Desired parking spot status to be set.
   */
  async updateParkingSpotStatus(
    parkingSpot: ParkingSpot,
    parkingStatus: ParkingSpotStatus,
  ) {
    const currentParkingSpot = parkingSpot;
    currentParkingSpot.status = parkingStatus;
    await this._parkingSpotRepository.save(currentParkingSpot);
    await this.emitParkingSpot();
  }
}
