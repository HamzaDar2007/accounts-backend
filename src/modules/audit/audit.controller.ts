import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { UserRole } from '../../common/enums/country.enum';

@ApiTags('Audit')
@ApiBearerAuth('JWT-auth')
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('activity-logs')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Get activity logs (Owner only)' })
  @ApiQuery({ name: 'action', required: false, description: 'Filter by action type' })
  @ApiQuery({ name: 'entityType', required: false, description: 'Filter by entity type' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records to return' })
  @ApiResponse({ status: 200, description: 'Activity logs returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  getActivityLogs(
    @CurrentTenant() companyId: string,
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.getActivityLogs(companyId, { action, entityType, limit });
  }

  @Get('user-activity')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Get user activity summary (Owner only)' })
  @ApiResponse({ status: 200, description: 'User activity summary returned successfully' })
  getUserActivity(@CurrentTenant() companyId: string) {
    return this.auditService.getUserActivity(companyId);
  }
}