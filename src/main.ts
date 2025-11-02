import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: configService.get('ALLOWED_ORIGINS')?.split(',') || [
      'http://localhost:3001',
    ],
    credentials: true,
  });

  app.setGlobalPrefix(configService.get('API_PREFIX') || 'api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Multi-Tenant Accounting System API')
    .setDescription(
      'A comprehensive multi-tenant accounting system built with NestJS, PostgreSQL, and TypeScript. Features include invoice management, multi-country VAT compliance, role-based access control, and bilingual support for UAE, KSA, and Egypt markets.',
    )
    .setVersion('1.0')
    .setContact(
      'API Support',
      'https://github.com/your-repo/accounting-api',
      'support@accounting-api.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer(`http://localhost:${configService.get('PORT') || 3000}`, 'Development server')
    .addServer('https://api.accounting-system.com', 'Production server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management operations')
    .addTag('Companies', 'Company management operations')
    .addTag('Customers', 'Customer management operations')
    .addTag('Items', 'Product and service item management')
    .addTag('Invoices', 'Invoice management operations')
    .addTag('Payments', 'Payment tracking and management')
    .addTag('VAT Management', 'VAT settings and management')
    .addTag('Invoice Templates', 'Invoice template management')
    .addTag('Reports', 'Financial and tax reports')
    .addTag('Accounting', 'Chart of accounts and journal entries')
    .addTag('Audit', 'Activity logs and audit trails')
    .addTag('FAQ', 'Frequently asked questions')
    .addTag('Onboarding', 'User onboarding and setup')
    .addTag('RBAC', 'Role-based access control')
    .addTag('File Upload', 'File upload operations')
    .addTag('PDF Generation', 'PDF document generation')
    .addTag('QR Code', 'QR code generation')
    .addTag('AWS', 'AWS integration services')
    .addTag('Backup', 'Database backup operations')
    .addTag('Health', 'System health and status')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

    console.log(
      `🚀 Application is running on: http://localhost:${port}/${configService.get('API_PREFIX') || 'api'}`,
    );
    console.log(
      `📚 Swagger documentation available at: http://localhost:${port}/api/docs`,
    );
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();
