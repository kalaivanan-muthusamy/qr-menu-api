import {
  Controller,
  SetMetadata,
  UseGuards,
  Get,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IAMService } from './iam.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/gaurds/jwt-auth.guard';

@ApiBearerAuth()
@Controller('iam/modules')
@SetMetadata('MODULE', 'IAM_MODULES')
export class IAMModulesController {
  constructor(private readonly iamService: IAMService) {}

  @SetMetadata('ACTION', ['VIEW_ALL'])
  @UseGuards(JwtAuthGuard)
  @Get()
  async allModules() {
    try {
      return await this.iamService.getAllModules();
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException();
    }
  }
}
