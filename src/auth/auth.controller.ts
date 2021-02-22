import {
  Controller,
  Body,
  Post,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticationDTO } from './dto/AuthenticationDTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async doAuthentication(
    @Body() authenticationDTO: AuthenticationDTO,
  ): Promise<any> {
    try {
      const result = await this.authService.doAuthentication(authenticationDTO);
      return result;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException();
    }
  }
}
