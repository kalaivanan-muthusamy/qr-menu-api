import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { IAMRolesModel } from './iam-roles.schema';
import { IAMUsersModel } from './iam-users.schema';
import { IAMUserRegistrationDTO } from './dto/iam-registration.dto';
// import { RolesModel } from 'src/roles/roles.schema';
import { IAMModulesModel } from './iam-modules.schema';
import { AddRoleDto } from './dto/add-role.dto';
import { ValidateJSON } from './../helpers/json-validation.helper';
import { permissionValidationSchema } from './helpers/permission-schema';
import { PERMISSION_TYPES } from './iam.constants';
import { UpdateRoleDto } from './dto/update-role.dto';
// import { NotificationsService } from './../notifications/notifications.service';
// import { FilesService } from './../files/files.service';
// import { S3Folders } from './../files/files.constants';
import { generateOTP } from './helpers/otp-helper';

@Injectable()
export class IAMService {
  constructor(
    @InjectModel('iam-users')
    private readonly iamUsersModel: Model<IAMUsersModel>,
    @InjectModel('iam-roles')
    private readonly iamRolesModel: Model<IAMRolesModel>,
    @InjectModel('iam-modules')
    private readonly iamModulesModel: Model<IAMModulesModel>, // private readonly notificationsService: NotificationsService, // private readonly filesService: FilesService,
  ) {}

  /**
   * Register a new user in IAM
   */
  async registerUser(iamUserRegistrationDTO: IAMUserRegistrationDTO) {
    const encryptedPassword = bcrypt.hashSync(
      iamUserRegistrationDTO.iamPassword,
      parseInt(process.env.PASSWORD_HASH_SALT_ROUND),
    );

    const iamUser = await this.iamUsersModel.create({
      name: iamUserRegistrationDTO.iamName,
      email: iamUserRegistrationDTO.iamEmail,
      mobileNumber: iamUserRegistrationDTO.iamMobileNumber,
      password: encryptedPassword,
      country: iamUserRegistrationDTO.iamCountry,
      roleId: iamUserRegistrationDTO.iamRoleId,
    });
    // this.requestEmailVerification(iamUser.email);
    return iamUser;
  }

  /**
   * Get a user details by one of below unique properties
   * 1.email, 2.mobileNumber
   */
  async getUserDetails({
    email = null,
    mobileNumber = null,
    IAMUserId = null,
  }) {
    try {
      const userDetails = <IAMUsersModel & { roleDetails: IAMRolesModel }>(
        await this.iamUsersModel
          .findOne({
            $or: [
              { email },
              { mobileNumber },
              { _id: Types.ObjectId(IAMUserId) },
            ],
            isActive: true,
            isDeleted: false,
          })
          .populate('roleDetails')
          .lean()
      );
      return userDetails;
    } catch (err) {
      console.error('ERROR', err);
      throw new Error(err);
    }
  }

  /**
   * Get all or individual IAM Role details
   */
  async getRoleDetails({ role }): Promise<IAMRolesModel | IAMRolesModel[]> {
    try {
      if (role) return await this.iamRolesModel.findOne({ key: role });
      await this.iamRolesModel.find();
    } catch (err) {
      console.error('ERROR', err);
      throw new Error(err);
    }
  }

  /**
   * Get all the roles
   */
  async getAllRoles() {
    try {
      const roles = await this.iamRolesModel.find();
      return roles;
    } catch (err) {
      console.error('ERROR', err);
      throw new Error(err);
    }
  }

  /**
   * Add a new role
   */
  async addRole(addRoleDto: AddRoleDto) {
    try {
      // Parse permissions details value
      const permissions = JSON.parse(addRoleDto.permissions);
      const [isValid] = ValidateJSON(permissionValidationSchema, permissions);
      if (!isValid)
        throw new HttpException('Permission contains incorrect value', 400);
      const modulePermissions = permissions.map((permission) => ({
        ...permission,
        type: PERMISSION_TYPES.MODULE_PERMISSION,
      }));

      const roles = await this.iamRolesModel.create({
        name: addRoleDto.name,
        key: addRoleDto.key,
        description: addRoleDto.description,
        permissions: modulePermissions,
      });

      return roles;
    } catch (err) {
      console.error('ERROR', err);
      throw new Error(err);
    }
  }

  /**
   * Update a role
   */
  async updateRole(updateRoleDto: UpdateRoleDto) {
    try {
      const iamRole = await this.iamRolesModel.findOne({
        _id: Types.ObjectId(updateRoleDto.roleId),
      });
      if (!iamRole) throw new HttpException('Roles not exist!', 400);

      if (updateRoleDto.name !== undefined) {
        iamRole.name = updateRoleDto.name;
      }

      if (updateRoleDto.description !== undefined) {
        iamRole.description = updateRoleDto.description;
      }

      if (updateRoleDto.isActive !== undefined) {
        iamRole.isActive = updateRoleDto.isActive;
      }

      if (updateRoleDto.permissions !== undefined) {
        // Parse permissions details value
        const permissions = JSON.parse(updateRoleDto.permissions);
        const [isValid] = ValidateJSON(permissionValidationSchema, permissions);
        if (!isValid)
          throw new HttpException('Permission contains incorrect value', 400);
        const modulePermissions = permissions.map((permission) => ({
          ...permission,
          type: PERMISSION_TYPES.MODULE_PERMISSION,
        }));
        iamRole.permissions = modulePermissions;
      }

      return await iamRole.save();
    } catch (err) {
      console.error('ERROR', err);
      throw new Error(err);
    }
  }

  /**
   * Get all the roles
   */
  async getAllModules() {
    try {
      const modules = await this.iamModulesModel.find();
      return modules;
    } catch (err) {
      console.error('ERROR', err);
      throw new Error(err);
    }
  }
}
