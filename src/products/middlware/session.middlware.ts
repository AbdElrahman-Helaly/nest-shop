import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.session || !request.session.userId) {
      throw new UnauthorizedException('Please log in to access this resource');
    }

    // Attach user info to request for easy access
    request.user = { id: request.session.userId };
    return true;
  }
}
