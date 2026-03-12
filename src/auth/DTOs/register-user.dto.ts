import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Full user name.',
    example: 'Giorgi Chanturia',
    minLength: 3,
  })
  fullName: string;

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
  @IsStrongPassword()
  @ApiProperty({
    description:
      'User password. Must contain at least 8 characters, including uppercase, lowercase, number, and special character.',
    example: 'Test123!',
    minLength: 8,
  })
  password: string;
}
