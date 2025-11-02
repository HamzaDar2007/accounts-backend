import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    AWS.config.update({
      region: this.configService.get('aws.region'),
      accessKeyId: this.configService.get('aws.accessKeyId'),
      secretAccessKey: this.configService.get('aws.secretAccessKey'),
    });

    this.s3 = new AWS.S3();
  }

  async uploadFile(key: string, body: Buffer, contentType: string) {
    const bucket =
      this.configService.get('aws.s3.bucket') || 'accounting-media';
    return this.s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
      .promise();
  }

  getEnvironmentStatus() {
    return {
      region: this.configService.get('aws.region') || 'me-south-1',
      environment: 'UAE Production',
      s3Configured: !!this.configService.get('aws.s3.bucket'),
    };
  }
}
