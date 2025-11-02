import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AwsService } from './aws.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/country.enum';

@ApiTags('AWS')
@ApiBearerAuth('JWT-auth')
@Controller('aws')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Get('status')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Get AWS environment status (Owner only)' })
  @ApiResponse({ status: 200, description: 'AWS environment status returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  getEnvironmentStatus() {
    return this.awsService.getEnvironmentStatus();
  }
}