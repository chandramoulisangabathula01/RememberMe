import { NextResponse } from 'next/server';
import { videoQueue } from '@/lib/queue';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Unauthorized', { status: 401 });

  const userId = (session.user as { id: string }).id;

  const { fileUrls } = await req.json();
  
  const job = await videoQueue.add('process-video', {
    userId: userId,
    files: fileUrls
  });

  return NextResponse.json({ jobId: job.id });
} 