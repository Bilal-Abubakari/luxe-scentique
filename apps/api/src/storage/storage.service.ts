import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = configService.get<string>('r2.bucketName') ?? '';
    this.publicUrl = configService.get<string>('r2.publicUrl') ?? '';

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${configService.get<string>('r2.accountId')}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: configService.get<string>('r2.accessKeyId') ?? '',
        secretAccessKey: configService.get<string>('r2.secretAccessKey') ?? '',
      },
    });
  }

  async upload(file: Express.Multer.File, folder = 'products'): Promise<string> {
    const extension = file.originalname.split('.').pop() ?? 'jpg';
    const key = `${folder}/${uuidv4()}.${extension}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000',
      }),
    );

    const url = `${this.publicUrl}/${key}`;
    this.logger.log(`Uploaded file: ${url}`);
    return url;
  }

  async delete(url: string): Promise<void> {
    const key = url.replace(`${this.publicUrl}/`, '');
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }));
    this.logger.log(`Deleted file: ${key}`);
  }
}
