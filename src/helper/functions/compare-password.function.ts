import * as bcrypt from 'bcrypt';

/**
 * This function is used to compare plain text password with hashed password and return
 * result based on comparison.
 *
 * @param plainPassword - Plain text password to be compared
 * @param hash - Hash password to be compared
 * @returns boolean
 */
export async function comparePassword(
  plainPassword: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hash);
}
