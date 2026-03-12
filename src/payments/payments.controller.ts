import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AddPaymentCardDTO } from './DTOs/add-payment-card.dto';
import { PaymentsService } from './payments.service';
import { CurrentUser } from 'src/helper/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { PayDTO } from './DTOs/pay.dto';
import { successResponse } from 'src/helper/functions/success-response.function';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  activeReservationNotFoundErrorMessage,
  paymentCardAlreadyExistsErrorMessage,
  paymentCardNotExistsErrorMessage,
  unauthorizedErrorMessage,
} from 'src/helper/messages/messages.variables';

/**
 * This controller is used to manage routing for the payment endpoints.
 * Whole controller is protected AuthGuard.
 */
@Controller('api/payments')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class PaymentsController {
  constructor(private _paymentsService: PaymentsService) {}

  /**
   * This endpoint is used to get payment card of the currently
   * signed in user.
   *
   * @param currentUser - Current user obtained by Param decorator.
   * @returns Promise containing current user's payment card
   */
  @Get('paymentCard')
  @ApiOperation({
    summary: 'Get current payment card.',
    description:
      'Returns currently saved payment card of the currently signed in user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved current payment card.',
    schema: {
      example: {
        status: 'success',
        data: {
          id: '17816193-1032-4a69-8d4e-a6c492cc5723',
          userId: '1aef23df-ac7c-4022-9637-03df7e7374d8',
          cardNumber: '************3333',
          cardExpirationMonth: 10,
          cardExpirationYear: 2029,
          cardHolderName: 'Giorgi TChanturia',
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
    description: 'Payment card for the current user does not exist.',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: paymentCardNotExistsErrorMessage,
          error: 'Not Found',
        },
      },
    },
  })
  async getPaymentCard(@CurrentUser() currentUser: User) {
    const paymentCard = await this._paymentsService.getPaymentCard(currentUser);
    return successResponse('success', paymentCard);
  }

  /**
   * This endpoint is used to add new payment card for the currently
   * signed in user.
   *
   * @param addPaymentCardDto - Request body containing payment card data.
   * @param currentUser - Current user obtained by Param decorator.
   * @returns Promise containing newly created payment card
   */
  @ApiOperation({
    summary: 'Add new payment card.',
    description:
      'Add new payment card for the currently signed in user with request body validated for correct information and newly added payment card is returned.',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully added new payment card.',
    schema: {
      example: {
        status: 'success',
        data: {
          id: '17816193-1032-4a69-8d4e-a6c492cc5723',
          userId: '1aef23df-ac7c-4022-9637-03df7e7374d8',
          cardNumber: '************3333',
          cardExpirationMonth: 10,
          cardExpirationYear: 2029,
          cardHolderName: 'Giorgi TChanturia',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request variations when adding new payment card.',
    content: {
      'application/json': {
        examples: {
          validationError: {
            summary: 'Request body validation errors',
            value: {
              statusCode: 400,
              message: ['cardNumber must be a credit card'],
              error: 'Bad Request',
            },
          },
          paymentCardAlreadyExistsError: {
            summary: 'Payment card already exists',
            value: {
              statusCode: 400,
              message: paymentCardAlreadyExistsErrorMessage,
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
  @Post('paymentCard')
  async addPaymentCard(
    @Body() addPaymentCardDto: AddPaymentCardDTO,
    @CurrentUser() currentUser: User,
  ) {
    const paymentCard = await this._paymentsService.addPaymentCard(
      addPaymentCardDto,
      currentUser,
    );
    return successResponse('success', paymentCard);
  }

  /**
   * This endpoint is used to delete payment card of the currently
   * signed in user.
   *
   * @param currentUser - Current user obtained by Param decorator.
   * @returns Promise containing deleted payment card
   */
  @ApiOperation({
    summary: 'Delete current payment card.',
    description:
      'Deletes currently saved payment card for the current user and newly deleted payment card is returned.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted current payment card.',
    schema: {
      example: {
        status: 'success',
        data: {
          userId: '1aef23df-ac7c-4022-9637-03df7e7374d8',
          cardNumber: '************3333',
          cardExpirationMonth: 10,
          cardExpirationYear: 2029,
          cardHolderName: 'Giorgi TChanturia',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Payment card does not exist for the current user.',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: paymentCardNotExistsErrorMessage,
          error: 'Not Found',
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
  @Delete('paymentCard')
  async deletePaymentCard(@CurrentUser() currentUser: User) {
    const paymentCard =
      await this._paymentsService.deletePaymentCard(currentUser);
    return successResponse('success', paymentCard);
  }

  /**
   * This endpoint is used to make payment for the currently
   * signed in user
   *
   * @param payDTO - Request body containing payment initialization data.
   * @param currentUser - Current user obtained by Param decorator.
   * @returns Promise containing payment result
   */
  @Post('pay')
  @ApiOperation({
    summary: 'Perform current reservation payment.',
    description:
      'Perform current payment transaction for currently active reservation.',
  })
  @ApiResponse({
    status: 201,
    description: 'Active reservation payment was successfull',
    schema: {
      example: {
        status: 'success',
        data: {
          paymentStatus: 'COMPLETED',
          paidAmount: 5,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Errors when validating request body.',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: [
            'reservationStatus must be one of the following values: CANCELLED, COMPLETED',
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
    description: 'Not found response variations when making payment.',
    content: {
      'application/json': {
        examples: {
          paymentCardNotFoundError: {
            summary: 'Payment card does not exist',
            value: {
              statusCode: 404,
              message: paymentCardNotExistsErrorMessage,
              error: 'Not Found',
            },
          },
          activeReservationNotFoundError: {
            summary: 'Active reservation does not exist',
            value: {
              statusCode: 404,
              message: activeReservationNotFoundErrorMessage,
              error: 'Not Found',
            },
          },
        },
      },
    },
  })
  async pay(@Body() payDTO: PayDTO, @CurrentUser() currentUser: User) {
    const paymentTransactionData = await this._paymentsService.pay(
      payDTO,
      currentUser,
    );
    return successResponse('success', paymentTransactionData);
  }
}
