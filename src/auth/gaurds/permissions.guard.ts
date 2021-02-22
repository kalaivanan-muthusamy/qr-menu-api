import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IAMService } from '../../iam/iam.service';
import { PERMISSION_TYPES } from '../../iam/iam.constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly iamService: IAMService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Get the user role & permissions
    const userDetails = await this.iamService.getUserDetails({
      email: user.email,
    });
    if (!userDetails) return false;

    const permissions = userDetails?.roleDetails?.permissions;
    if (!permissions) return false;

    // Get the required module and action permission from meta data
    const module = this.reflector.get<string>('MODULE', context.getClass());
    const actions = this.reflector.get<string[]>(
      'ACTION',
      context.getHandler(),
    );

    const modulePermission = permissions.find(
      (permission) =>
        permission.type === PERMISSION_TYPES.MODULE_PERMISSION &&
        permission.moduleKey === module,
    );
    if (!modulePermission) return false;

    const actionsPermitted = modulePermission.actionsPermitted;
    const isPermittedAction = actions.find((action) =>
      actionsPermitted.includes(action),
    );

    return !!isPermittedAction;
  }
}
