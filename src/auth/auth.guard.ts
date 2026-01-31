import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const currentSessionUserData = request.session.user;

    if (currentSessionUserData) {
      const currentUser = await this._usersService.findOne(
        currentSessionUserData.id,
      );
      if (currentUser) {
        request.currentUser = currentUser;
        return true;
      } else {
        throw new UnauthorizedException(
          'You are not authorized to view this content. Please register or log in!',
        );
      }
    } else {
      throw new UnauthorizedException(
        'You are not authorized to view this content. Please register or log in!',
      );
    }
  }
}
