import { Body, Controller, Post, Session } from '@nestjs/common';
import { RegisterUserDTO } from './DTOs/register-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './DTOs/login-user.dto';
import { saveUserToSession } from 'src/helper/functions/save-user-to-session.function';

@Controller('api/auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerUserDTO: RegisterUserDTO,
    @Session() session: Record<string, any>,
  ) {
    const result = await this._authService.register(registerUserDTO);

    saveUserToSession(result, session);

    return {
      success: true,
      message: `Successfully registered user ${result.fullName}`,
    };
  }

  @Post('login')
  async login(
    @Body() loginUserDTO: LoginUserDTO,
    @Session() session: Record<string, any>,
  ) {
    const result = await this._authService.login(loginUserDTO);

    saveUserToSession(result, session);

    return {
      success: true,
      message: `Successfully signed in user ${result.fullName}`,
    };
  }
}
