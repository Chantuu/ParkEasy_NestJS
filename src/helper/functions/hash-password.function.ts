import * as bcrypt from 'bcrypt';

/**
 * This function takes plain text password and turns into hashed password.
 *
 * @param passwordToHash - Plain text password to be hashed.
 * @returns string
 */
export async function hashPassword(passwordToHash: string): Promise<string> {
  return await bcrypt.hash(passwordToHash, 10);
}
