import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get('/api')
  async checkApi() {
    return `Api PJX is running in ${process.env.NODE_ENV} mode`;
  }
}
