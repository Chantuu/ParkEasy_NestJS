import {
  Body,
  Controller,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import { RegisterUserDTO } from './DTOs/register-user.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDTO: RegisterUserDTO) {
    return await this._authService.register(registerUserDTO);
  }
}
