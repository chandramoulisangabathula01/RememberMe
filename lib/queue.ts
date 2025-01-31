import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const videoQueue = new Queue('video-processing', {
  connection: new IORedis(process.env.REDIS_URL || 'redis://localhost:6379')
});

export enum VideoProcessSteps {
  COMBINE_MEDIA = 'combining-media',
  ADD_EFFECTS = 'adding-effects',
  UPLOAD_S3 = 'uploading-to-s3'
} 