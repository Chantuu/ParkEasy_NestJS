import { User } from 'src/users/user.entity';

/**
 * This function is used to save user entitys id, fullName and email field
 * in session cookie.
 *
 * @param user - User Entity
 * @param session - Session Object
 */
export function saveUserToSession(
  user: User,
  session: Record<string, any>,
): void {
  session.user = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
  };
}
