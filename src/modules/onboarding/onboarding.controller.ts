import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@ApiTags('Onboarding')
@ApiBearerAuth('JWT-auth')
@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('steps')
  @ApiOperation({ summary: 'Get onboarding steps' })
  @ApiResponse({ status: 200, description: 'Onboarding steps returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getSteps(@CurrentTenant() companyId: string) {
    return this.onboardingService.getSteps(companyId);
  }

  @Post('steps/:stepName/complete')
  @ApiOperation({ summary: 'Mark onboarding step as complete' })
  @ApiParam({ name: 'stepName', description: 'Step name to complete' })
  @ApiResponse({ status: 200, description: 'Step marked as complete successfully' })
  @ApiResponse({ status: 404, description: 'Step not found' })
  completeStep(@Param('stepName') stepName: string, @CurrentTenant() companyId: string) {
    return this.onboardingService.completeStep(companyId, stepName);
  }

  @Get('progress')
  @ApiOperation({ summary: 'Get onboarding progress' })
  @ApiResponse({ 
    status: 200, 
    description: 'Onboarding progress returned successfully',
    example: {
      totalSteps: 5,
      completedSteps: 3,
      progressPercentage: 60,
      nextStep: 'create_first_invoice'
    }
  })
  getProgress(@CurrentTenant() companyId: string) {
    return this.onboardingService.getProgress(companyId);
  }

  @Post('initialize')
  @ApiOperation({ summary: 'Initialize onboarding steps for company' })
  @ApiResponse({ status: 201, description: 'Onboarding steps initialized successfully' })
  initializeSteps(@CurrentTenant() companyId: string) {
    return this.onboardingService.initializeSteps(companyId);
  }
}