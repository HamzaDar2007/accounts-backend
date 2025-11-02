import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Multi-Tenant Accounting API - Milestone 1 Complete!';
  }
}
