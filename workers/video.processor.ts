import { Worker, Job } from 'bullmq';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createReadStream } from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { VideoProcessSteps } from '@/lib/queue';
import IORedis from 'ioredis';

const execAsync = promisify(exec);
const s3Client = new S3Client({ region: process.env.AWS_REGION });

new Worker('video-processing', async (job: Job) => {
  const { userId, files } = job.data;
  
  try {
    // 1. Combine media files
    await job.updateProgress({ step: VideoProcessSteps.COMBINE_MEDIA, progress: 0 });
    const outputPath = await combineMediaFiles(files);
    
    // 2. Add effects/watermark
    await job.updateProgress({ step: VideoProcessSteps.ADD_EFFECTS, progress: 50 });
    const finalPath = await applyVideoEffects(outputPath);
    
    // 3. Upload to S3
    await job.updateProgress({ step: VideoProcessSteps.UPLOAD_S3, progress: 90 });
    const s3Url = await uploadToS3(finalPath, userId);
    
    return { s3Url };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Video processing failed: ${message}`);
  }
}, { 
  connection: new IORedis(process.env.REDIS_URL!)
});

async function combineMediaFiles(files: string[]) {
  // FFmpeg implementation to combine files
  const outputPath = `/tmp/${Date.now()}.mp4`;
  const command = `ffmpeg ${files.map(f => `-i ${f}`).join(' ')} \
    -filter_complex concat=n=${files.length}:v=1:a=1 ${outputPath}`;
  
  await execAsync(command);
  return outputPath;
}

async function applyVideoEffects(inputPath: string) {
  // Example: Add watermark and transition
  const outputPath = `/tmp/processed-${Date.now()}.mp4`;
  const command = `ffmpeg -i ${inputPath} \
    -i watermark.png -filter_complex "overlay=10:10" \
    -vf fade=in:0:30 ${outputPath}`;
  
  await execAsync(command);
  return outputPath;
}

async function uploadToS3(filePath: string, userId: string) {
  const fileKey = `processed/${userId}/${Date.now()}.mp4`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
    Body: createReadStream(filePath)
  });
  
  await s3Client.send(command);
  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
} 