import { IsEmail, IsStrongPassword } from 'class-validator';

/**
 * This class is used to validate the request body for
 * the POST /api/auth/login Endpoint.
 */
export class LoginUserDTO {
  /**
   * This property is used to check, that proper email is present in request body.
   */
  @IsEmail()
  email: string;

  /**
   * This property is used to check, that proper strong password is present in request body.
   */
  @IsStrongPassword()
  password: string;
}
