import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private s3: S3Client;

  constructor(private configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('aws.accessKeyId');
    const secretAccessKey = this.configService.get<string>('aws.secretAccessKey');
    const region = this.configService.get<string>('aws.region');

    this.s3 = new S3Client({
      region,
      credentials: accessKeyId && secretAccessKey ? {
        accessKeyId,
        secretAccessKey,
      } : undefined,
    });
  }

  async uploadFile(key: string, body: Buffer, contentType: string) {
    const bucket =
      this.configService.get('aws.s3.bucket') || 'accounting-media';
    
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    const result = await this.s3.send(command);
    
    return {
      Location: `https://${bucket}.s3.${this.configService.get('aws.region')}.amazonaws.com/${key}`,
      Key: key,
      ETag: result.ETag,
    };
  }

  getEnvironmentStatus() {
    return {
      region: this.configService.get('aws.region') || 'me-south-1',
      environment: 'UAE Production',
      s3Configured: !!this.configService.get('aws.s3.bucket'),
    };
  }
}
