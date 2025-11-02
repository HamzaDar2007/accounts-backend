import { Controller, Get, SetMetadata } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { CountryConfigService } from './common/services/country-config.service';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly countryConfigService: CountryConfigService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get welcome message' })
  @ApiResponse({ status: 200, description: 'Welcome message returned successfully' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('countries')
  @ApiOperation({ summary: 'Get all supported countries with VAT rates' })
  @ApiResponse({ status: 200, description: 'Countries list returned successfully' })
  getCountries() {
    return this.countryConfigService.getAllCountries();
  }

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service health status' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Accounting API',
    };
  }
}
