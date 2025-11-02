import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  getActivityLogs(companyId: string, filters: any) {
    return { message: 'Activity logs feature coming soon', companyId, filters };
  }

  getUserActivity(companyId: string) {
    return { message: 'User activity feature coming soon', companyId };
  }
}