import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

/**
 * This class is used to validate the request body for
 * the POST /api/auth/register Endpoint.
 */
export class RegisterUserDTO {
  /**
   * /**
   * This property is used to check, that proper string is present in request body.
   */
  @IsString()
  fullName: string;

  /**
   * This property is used to check, that proper email is present in request body.
   */
  @IsEmail()
  email: string;

  /**
   * This property is used to check, that proper strong password is present in request body.
   */
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
