import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { AwsModule } from './modules/aws/aws.module';
import { BackupModule } from './modules/backup/backup.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { PdfGenerationModule } from './modules/pdf-generation/pdf-generation.module';
import { QrCodeModule } from './modules/qr-code/qr-code.module';
import { VatManagementModule } from './modules/vat-management/vat-management.module';
import { InvoiceTemplatesModule } from './modules/invoice-templates/invoice-templates.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ItemsModule } from './modules/items/items.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { AuditModule } from './modules/audit/audit.module';
import { FaqModule } from './modules/faq/faq.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { TenantInterceptor } from './common/interceptors/tenant.interceptor';
import { CommonModule } from './common/common.module';
import { EncryptionService } from './common/services/encryption.service';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import awsConfig from './config/aws.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, awsConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database')!,
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CompaniesModule,
    RbacModule,
    AwsModule,
    BackupModule,
    InvoicesModule,
    FileUploadModule,
    PdfGenerationModule,
    QrCodeModule,
    VatManagementModule,
    InvoiceTemplatesModule,
    CustomersModule,
    ItemsModule,
    PaymentsModule,
    ReportsModule,
    AccountingModule,
    AuditModule,
    FaqModule,
    OnboardingModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EncryptionService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
})
export class AppModule {}
