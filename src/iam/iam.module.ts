import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IAMService } from './iam.service';
import { IAMController } from './iam.controller';
import { IAMUsersSchema } from './iam-users.schema';
import { IAMRolesSchema } from './iam-roles.schema';
import { IAMModulesSchema } from './iam-modules.schema';
import { IAMRolesController } from './iam-roles.controller';
import { IAMModulesController } from './iam-modules.controller';
import { IAMUsersController } from './iam-users.controller';
// import { NotificationsModule } from './../notifications/notifications.module';
// import { FilesModule } from './../files/files.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'iam-users', schema: IAMUsersSchema }]),
    MongooseModule.forFeature([{ name: 'iam-roles', schema: IAMRolesSchema }]),
    MongooseModule.forFeature([
      { name: 'iam-modules', schema: IAMModulesSchema },
    ]),
    // NotificationsModule,
    // FilesModule,
  ],
  controllers: [
    IAMController,
    IAMUsersController,
    IAMRolesController,
    IAMModulesController,
  ],
  providers: [IAMService],
  exports: [IAMService],
})
export class IAMModule {}
