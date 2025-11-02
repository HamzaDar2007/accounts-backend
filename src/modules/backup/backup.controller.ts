import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BackupService } from './backup.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/country.enum';

@ApiTags('Backup')
@ApiBearerAuth('JWT-auth')
@Controller('backup')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('status')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Get backup status (Owner only)' })
  @ApiResponse({ status: 200, description: 'Backup status returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  getBackupStatus() {
    return this.backupService.getBackupStatus();
  }

  @Post('create')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Create database backup (Owner only)' })
  @ApiResponse({ status: 200, description: 'Database backup created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  createBackup() {
    return this.backupService.createDatabaseBackup();
  }
}