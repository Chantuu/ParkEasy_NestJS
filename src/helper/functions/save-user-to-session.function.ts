import { User } from 'src/users/user.entity';

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
