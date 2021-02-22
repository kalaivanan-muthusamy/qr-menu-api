import { Injectable, HttpException } from '@nestjs/common';
import { AuthenticationDTO } from './dto/AuthenticationDTO';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { IAMService } from '../iam/iam.service';

@Injectable()
export class AuthService {
  constructor(private iamService: IAMService, private jwtService: JwtService) {}

  async doAuthentication(authenticationDTO: AuthenticationDTO): Promise<any> {
    const iamUserDetails = await this.iamService.getUserDetails({
      email: authenticationDTO.email,
      mobileNumber: authenticationDTO.mobileNumber,
    });
    if (!iamUserDetails)
      throw new HttpException('Unable to find this user in our records', 400);
    // if (!iamUserDetails.isEmailVerified)
    //   throw new HttpException('Email is not verified yet!', 400);
    if (!iamUserDetails.isActive)
      throw new HttpException('You account has been disabled', 400);
    if (!(await compare(authenticationDTO.password, iamUserDetails.password))) {
      throw new HttpException('Invalid password', 400);
    }

    delete iamUserDetails.password;

    return {
      IAMUserId: iamUserDetails._id,
      fullName: iamUserDetails.name,
      role: iamUserDetails?.roleDetails?.key,
      ...iamUserDetails,
      accessToken: this.jwtService.sign({
        IAMUserId: iamUserDetails._id,
        roleId: iamUserDetails.roleId,
        role: iamUserDetails?.roleDetails?.key,
        email: iamUserDetails.email,
        mobileNumber: iamUserDetails.mobileNumber,
      }),
    };
  }
}
