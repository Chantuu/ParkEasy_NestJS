import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { unauthorizedErrorMessage } from 'src/helper/messages/messages.variables';
import { UsersService } from 'src/users/users.service';

/**
 * This guard is responsible for guarding endpoints, which require user authorization.
 * If user has logged in the application, protected endpoints become accessible and
 * this guard automatically attaches current user entity to the request.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentSessionUserData = request.session.user;

    // If user data exists in session
    if (currentSessionUserData) {
      const currentUser = await this._usersService.findOne(
        currentSessionUserData.id,
      );

      // Try to retrieve user entity
      if (currentUser) {
        request.currentUser = currentUser;
        return true;
      } else {
        throw new UnauthorizedException(unauthorizedErrorMessage);
      }
    } else {
      throw new UnauthorizedException(unauthorizedErrorMessage);
    }
  }
}
