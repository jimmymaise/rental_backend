import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// TODO: NOT COMPLETED YET
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    console.log('iii', permissions);
    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    console.log('dddd', permissions, request);
    const user = request.user;

    return true;
  }
}