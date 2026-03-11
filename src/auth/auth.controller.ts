import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { RegisterUserDTO } from './DTOs/register-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './DTOs/login-user.dto';
import { saveUserToSession } from 'src/helper/functions/save-user-to-session.function';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from 'src/helper/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { successResponse } from 'src/helper/functions/success-response.function';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import {
  emailAlreadyExistsErrorMessage,
  unauthorizedErrorMessage,
  userWithEmailPasswordNotExistsErrorMessage,
} from 'src/helper/messages/messages.variables';

/**
 * This controller is responsible for handling authentication routes.
 */
@Controller('api/auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  /**
   * This endpoint is responsible for registering user in the program.
   *
   * @param registerUserDTO - Request body validator.
   * @param session - Session object.
   * @returns Response object with success and message fields.
   */
  @ApiOperation({
    summary: 'Register new user.',
    description:
      'Registers new user in the application with request body validated for correct information and returns newly registered user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully registered new user.',
    schema: {
      example: {
        status: 'success',
        data: {
          id: '1aef23df-ac7c-4022-9637-03df7e7374d8',
          fullName: 'Giorgi Chanturia',
          email: 'giorgi@email.com',
          money: 20,
        },
        message: 'Successfully registered user Giorgi Chanturia',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request variations when registering new user.',
    content: {
      'application/json': {
        examples: {
          validationError: {
            summary: 'Request body validation errors',
            value: {
              statusCode: 400,
              message: ['email must be an email'],
              error: 'Bad Request',
            },
          },
          userIsRegisteredError: {
            summary: 'User with specified email is already registered',
            value: {
              message: emailAlreadyExistsErrorMessage,
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        },
      },
    },
  })
  @Post('register')
  async register(
    @Body() registerUserDTO: RegisterUserDTO,
    @Session() session: Record<string, any>,
  ) {
    const registeredUser = await this._authService.register(registerUserDTO);
    saveUserToSession(registeredUser, session);

    return successResponse(
      'success',
      {
        id: registeredUser.id,
        fullName: registeredUser.fullName,
        email: registeredUser.email,
        money: registeredUser.money,
      },
      `Successfully registered user ${registeredUser.fullName}`,
    );
  }

  /**
   * This endpoint is responsible for signing in user in the program.
   *
   * @param loginUserDTO - Request body validator.
   * @param session - Session object.
   * @returns Response object with success and message fields.
   */
  @ApiOperation({
    summary: 'Sign in the application.',
    description:
      'Sign in the application with request body validated for correct information and returns newly signed in user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully registered new user.',
    schema: {
      example: {
        status: 'success',
        data: {
          id: '1aef23df-ac7c-4022-9637-03df7e7374d8',
          fullName: 'Giorgi Chanturia',
          email: 'giorgi@email.com',
          money: 20,
        },
        message: 'Successfully signed in user Giorgi Chanturia',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request variations when registering new user.',
    content: {
      'application/json': {
        examples: {
          validationError: {
            summary: 'Request body validation errors',
            value: {
              statusCode: 400,
              message: ['email must be an email'],
              error: 'Bad Request',
            },
          },
          userIsRegisteredError: {
            summary: 'User does not exist with specified credentials',
            value: {
              message: userWithEmailPasswordNotExistsErrorMessage,
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        },
      },
    },
  })
  @Post('login')
  async login(
    @Body() loginUserDTO: LoginUserDTO,
    @Session() session: Record<string, any>,
  ) {
    const loggedInUser = await this._authService.login(loginUserDTO);
    saveUserToSession(loggedInUser, session);

    return successResponse(
      'success',
      {
        id: loggedInUser.id,
        fullName: loggedInUser.fullName,
        email: loggedInUser.email,
        money: loggedInUser.money,
      },
      `Successfully signed in user ${loggedInUser.fullName}`,
    );
  }

  /**
   * This endpoint is used to return currently signed in user data.
   * It is protected by AuthGuard.
   *
   * @param currentUser - Current user obtained by Param decorator.
   * @returns Promise with response object containing current user data
   */
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Get currently signed in user.',
    description: 'Returns currently signed in user information as a response.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved current user.',
    schema: {
      example: {
        status: 'success',
        data: {
          id: '1aef23df-ac7c-4022-9637-03df7e7374d8',
          fullName: 'Giorgi Chanturia',
          email: 'giorgi@email.com',
          money: 20,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'User is not signed in in the application.',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: unauthorizedErrorMessage,
          error: 'Unauthorized',
        },
      },
    },
  })
  @Get('currentUser')
  @UseGuards(AuthGuard)
  async getCurrentUser(@CurrentUser() currentUser: User) {
    return successResponse('success', {
      id: currentUser.id,
      fullName: currentUser.fullName,
      email: currentUser.email,
      money: currentUser.money,
    });
  }

  /**
   * This endpoint is responsible for signing out user from the application.
   * It is protected by AuthGuard.
   *
   * @param session - Session object.
   * @returns Response object with success and message fields.
   */
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Log out current user.',
    description: 'Logs out current user from the application.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out current user.',
    schema: {
      example: {
        status: 'success',
        message: 'Successfully logged out user Giorgi Chanturia',
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
  @Get('logout')
  @UseGuards(AuthGuard)
  logout(@Session() session: Record<string, any>) {
    const { fullName } = session.user; // Get name of the current user
    session.user = undefined; // Log out current user

    return successResponse(
      'success',
      undefined,
      `Successfully logged out user ${fullName}`,
    );
  }

  /**
   * This endpoint is responsible for completely deleting user profile with related information, such as
   * payment and reservation data.
   * It is protected by AuthGuard.
   *
   * @param currentUser - Current user obtained by Param decorator.
   * @param session - Session object.
   * @returns Response object with success and message fields.
   */
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Delete current user.',
    description:
      "Completely deletes current user and it's associated data from the application.",
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out current user.',
    schema: {
      example: {
        status: 'success',
        message: 'Successfully deleted user Giorgi Chanturia',
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
  @Delete('delete')
  @UseGuards(AuthGuard)
  async deleteCurrentUser(
    @CurrentUser() currentUser: User,
    @Session() session: Record<string, any>,
  ) {
    const deletedUser = await this._authService.deleteCurrentUser(
      currentUser.id,
    );
    session.user = undefined; // Log out user after deleting

    return successResponse(
      'success',
      `Successfully deleted user ${deletedUser.fullName}`,
    );
  }
}
