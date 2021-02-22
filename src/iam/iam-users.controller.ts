import { Controller, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('iam/users')
@ApiBearerAuth()
@SetMetadata('MODULE', 'IAM_USERS')
export class IAMUsersController {}
