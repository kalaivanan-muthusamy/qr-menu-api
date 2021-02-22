import { Controller } from '@nestjs/common';
import { IAMService } from './iam.service';

@Controller('iam')
export class IAMController {
  constructor(private readonly iamService: IAMService) {}
}
