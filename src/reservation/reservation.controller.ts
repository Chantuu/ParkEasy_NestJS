import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/helper/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ReservationService } from './reservation.service';
import { CreateReservationDTO } from './DTOs/create-reservation.dto';
import { EditReservationDTO } from './DTOs/edit-reservation.dto';
import { successResponse } from 'src/helper/functions/success-response.function';
import { map } from 'rxjs';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  activeReservationAlreadyExitsErrorMessage,
  activeReservationNotFoundErrorMessage,
  parkingSpotIdErrorMessage,
  reservationNotFoundErroMessage,
  unauthorizedErrorMessage,
} from 'src/helper/messages/messages.variables';

/**
 * This controller is used to manage routing for the reservation endpoints.
 * Whole controller is protected AuthGuard.
 */
@ApiCookieAuth()
@Controller('api/reservation')
@UseGuards(AuthGuard)
export class ReservationController {
  constructor(private _reservationService: ReservationService) {}

  /**
   * This SSE endpoint continously streams data of the currently active reservation.
   * If active reservation is available at the moment, this endpoint vill stream null.
   *
   * @returns Object containing data of the active reservation or null
   */
  @Sse()
  @ApiOperation({
    summary: 'Get currently active reservation.',
    description:
      'Currently active reservation is streamed to the client. If no active reservation exists,' +
      "null value is streamed to signify it\'s nonexistence. Please note, that Swagger does not support SSE " +
      'and you have to test this endpoint manually.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Server-Sent Events (SSE) stream of the current active reservation or null',
    content: {
      'text/event-stream': {
        examples: {
          activeReservation: {
            summary: 'Active resevration exists',
            value: {
              id: '745b8e60-28c9-4a2c-9556-1565a497f391',
              userId: '1aef23df-ac7c-4022-9637-03df7e7374d8',
              parkingSpotName: 'spot-A',
              startTime: '2026-03-12T13:37:32.568Z',
              status: 'COMPLETED',
              amount: 1,
            },
          },
          noActiveReservation: {
            summary: 'Active reservation does not exist',
            value: 'null',
          },
        },
      },
    },
  })
  async getCurrentActiveReservationStream(@CurrentUser() currentUser: User) {
    return (
      await this._reservationService.getCurrentActiveReservation(currentUser)
    ).pipe(
      map((reservation) => {
        return { data: reservation ?? JSON.stringify(null) };
      }),
    );
  }

  /**
   * This endpoint creates new active reservation for the current user only
   * when it does not have any active reservation.
   *
   * @param currentUser - User currently signed in.
   * @param createReservationDTO - Request body containing reservation data for creation.
   * @returns Promise containing newly created reservation data
   */
  @ApiOperation({
    summary: 'Create new reservation.',
    description:
      'Create new reservation for the desired parking spot, if that parking spot is free and return newly created reservation data',
  })
  @ApiResponse({
    status: 201,
    description: 'New reservation was successfully created.',
    schema: {
      example: {
        status: 'success',
        data: {
          id: '745b8e60-28c9-4a2c-9556-1565a497f391',
          userId: '1aef23df-ac7c-4022-9637-03df7e7374d8',
          parkingSpotName: 'spot-A',
          startTime: '2026-03-12T13:37:32.568Z',
          status: 'ACTIVE',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request variations when creating new reservation.',
    content: {
      'application/json': {
        examples: {
          validationError: {
            summary: 'Request body validation errors',
            value: {
              statusCode: 400,
              message: ['parkingSpotId must be a UUID'],
              error: 'Bad Request',
            },
          },
          reservationAlreadyExistsError: {
            summary: 'Active reservation already exists',
            value: {
              statusCode: 400,
              message: activeReservationAlreadyExitsErrorMessage,
              error: 'Bad Request',
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'User is not signed in in the application.',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: unauthorizedErrorMessage,
          error: 'Unauthorized',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Parking spot with specified id is not found',
    content: {
      'applicaton/json': {
        example: {
          statusCode: 404,
          message: parkingSpotIdErrorMessage,
          error: 'Not Found',
        },
      },
    },
  })
  @Post()
  async createReservation(
    @CurrentUser() currentUser: User,
    @Body() createReservationDTO: CreateReservationDTO,
  ) {
    const newReservation = await this._reservationService.createReservation(
      currentUser,
      createReservationDTO,
    );
    return successResponse('success', newReservation);
  }

  /**
   * This endpoint is used to change status of the active reservation for current
   * user, when it cancelled or checked in reservation.
   *
   * @param currentUser - User currently signed in.
   * @param editReservationDTO - Request body containing reservation data for updating.
   * @returns Promise containing recently updated reservation data
   */
  @Patch()
  @ApiOperation({
    summary: 'Edit currently active reservation',
    description:
      "Edit currently active reservation after completing payment to update it's status.",
  })
  @ApiResponse({
    status: 201,
    description: 'Success response variations when editing active reservation.',
    examples: {
      completedActiveReservation: {
        summary: 'Active reservation marked as completed',
        value: {
          status: 'success',
          data: {
            id: '745b8e60-28c9-4a2c-9556-1565a497f391',
            userId: '1aef23df-ac7c-4022-9637-03df7e7374d8',
            parkingSpotName: 'spot-A',
            startTime: '2026-03-12T13:37:32.568Z',
            status: 'COMPLETED',
            amount: 5,
          },
        },
      },
      cancelledActiveReservation: {
        summary: 'Active reservation marked as cancelled',
        value: {
          status: 'success',
          data: {
            id: '745b8e60-28c9-4a2c-9556-1565a497f391',
            userId: '1aef23df-ac7c-4022-9637-03df7e7374d8',
            parkingSpotName: 'spot-A',
            startTime: '2026-03-12T13:37:32.568Z',
            status: 'CANCELLED',
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Request body validation failed when editing active reservation.',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: [
            'status must be one of the following values: CANCELLED, COMPLETED',
          ],
          error: 'Bad Request',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'User is not signed in in the application.',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: unauthorizedErrorMessage,
          error: 'Unauthorized',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Active reservation for current user does not exist.',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: activeReservationNotFoundErrorMessage,
          error: 'Not Found',
        },
      },
    },
  })
  async editActiveReservation(
    @CurrentUser() currentUser: User,
    @Body() editReservationDTO: EditReservationDTO,
  ) {
    const editedReservation =
      await this._reservationService.editActiveReservation(
        currentUser,
        editReservationDTO,
      );
    return successResponse('success', editedReservation);
  }

  /**
   * This endpoint returns calculated price amount data of the active reservation for
   * the current user, if it already has active reservation.
   *
   * @param currentUser - User currently signed in.
   */
  @ApiOperation({
    summary: 'Calculate price for the currently active reservation.',
    description:
      'Calculate amount of price to pay for the currently active reservation.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully caclulated price for the active reservation.',
    schema: {
      example: {
        status: 'success',
        data: {
          startTime: '2026-03-12T13:37:32.568Z',
          endTime: '2026-03-12T18:32:24.558Z',
          amount: 1.11,
          currency: 'GEL',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'User is not signed in in the application.',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: unauthorizedErrorMessage,
          error: 'Unauthorized',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Active reservation for current user does not exist.',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: activeReservationNotFoundErrorMessage,
          error: 'Not Found',
        },
      },
    },
  })
  @Get('calculatePrice')
  async caclulateReservationPrice(@CurrentUser() currentUser: User) {
    const result =
      await this._reservationService.calculateReservationPrice(currentUser);
    return successResponse('success', result);
  }

  /**
   * This method returns all inactive reservation entity list of the current user.
   *
   * @param currentUser - User currently signed in.
   * @returns Promise containing list of formatted reservation data
   */
  @ApiOperation({
    summary: 'Get old reservation history.',
    description: 'Get list of all old reservations.',
  })
  @ApiResponse({
    status: 200,
    description: 'Old reservation history.',
    content: {
      'application/json': {
        example: {
          status: 'success',
          data: [
            {
              id: '45b8e60-28c9-4a2c-9556-1565a497f391',
              userId: '1aef23df-ac7c-4022-9637-03df7e7374d8',
              parkingSpotId: 'spot-A',
              startTime: '2026-03-12T13:37:32.568',
              status: 'COMPLETED',
              amount: 5,
            },
          ],
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Inactive reservations are not found.',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: reservationNotFoundErroMessage,
          error: 'Not Found',
        },
      },
    },
  })
  @Get('inactive')
  async getAllReservation(@CurrentUser() currentUser: User) {
    const userReservations =
      await this._reservationService.getInactiveReservation(currentUser);
    return successResponse('success', userReservations);
  }
}
