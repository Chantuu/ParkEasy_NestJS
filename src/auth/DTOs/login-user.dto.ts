import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'User email address. Must be a valid email format.',
    example: 'giorgi@email.com',
  })
  email: string;

  /**
   * This property is used to check, that proper strong password is present in request body.
   */
  @ApiProperty({
    description:
      'User password. Must contain at least 8 characters, including uppercase, lowercase, number, and special character.',
    example: 'Test123!',
    minLength: 8,
  })
  @IsStrongPassword()
  password: string;
}
