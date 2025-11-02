import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  region: process.env.AWS_REGION || 'me-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3: {
    bucket: process.env.AWS_S3_BUCKET || 'accounting-media',
    endpoint: process.env.AWS_S3_ENDPOINT,
  },
  rds: {
    backupRetentionPeriod: 7,
    backupWindow: '03:00-04:00',
    maintenanceWindow: 'sun:04:00-sun:05:00',
  },
}));