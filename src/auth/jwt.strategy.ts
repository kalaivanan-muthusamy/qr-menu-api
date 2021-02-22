import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<any> {
    const requiredProperties = [
      'IAMUserId',
      'roleId',
      'role',
      'email',
      'mobileNumber',
    ];
    if (!payload) return false;

    // Validate if the required keys are exist in JWT Payload
    const availableProperties = requiredProperties.filter(
      (key) => payload[key],
    );
    if (availableProperties.length !== requiredProperties.length) {
      return false;
    }

    return payload;
  }
}
