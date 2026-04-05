import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'node:crypto';

export enum UploadPresets {
  PRODUCTS = 'PRODUCTS',
}

export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  existing: boolean;
  original_filename: string;
}


@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async upload(file: Express.Multer.File, preset: UploadPresets): Promise<string> {
    const timestamp = Date.now();
    const publicId = `${file.originalname}-${timestamp}`;
    const formData = new FormData();

    const uint8Array = new Uint8Array(file.buffer);
    const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
    formData.append('file', blob, file.originalname);
    formData.append('public_id', publicId);
    formData.append('api_key', this.configService.get<string>('cloudinary.apiKey') ?? '');
    formData.append('timestamp', timestamp.toString());
    formData.append(
      'upload_preset',
      this.configService.get<string>(`cloudinary.presets.${preset}`) ?? '',
    );

    try {
      const response = await firstValueFrom(
        this.httpService.post<CloudinaryUploadResponse>(
          this.configService.get<string>('cloudinary.baseUrl') ?? '',
          formData,
          { headers: { 'content-type': 'multipart/form-data' } },
        ),
      );

      this.logger.log(`Uploaded file: ${response.data.secure_url}`);
      return response.data.secure_url;
    } catch (error) {
      this.logger.error(`Error: ${(error as Error).message}`);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async delete(publicId: string): Promise<void> {
    const timestamp = Math.floor(Date.now() / 1000);
    const apiKey = this.configService.get<string>('cloudinary.apiKey') ?? '';
    const apiSecret = this.configService.get<string>('cloudinary.apiSecret') ?? '';

    const signaturePayload = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signaturePayload).digest('hex');

    const destroyUrl = (this.configService.get<string>('cloudinary.baseUrl') ?? '').replace(
      '/upload',
      '/destroy',
    );

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    try {
      await firstValueFrom(
        this.httpService.post(destroyUrl, formData, {
          headers: { 'content-type': 'multipart/form-data' },
        }),
      );
      this.logger.log(`Deleted file: ${publicId}`);
    } catch (error) {
      this.logger.error(`Error: ${(error as Error).message}`);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}
