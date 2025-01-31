import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { UploadCloudIcon } from 'lucide-react';

export function MediaUploader() {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    maxFiles: 10,
    maxSize: 500 * 1024 * 1024, // 500MB
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'video/*': ['.mp4', '.mov']
    }
  });

  const totalSize = acceptedFiles.reduce((sum, file) => sum + file.size, 0);
  const isOverLimit = totalSize > 500 * 1024 * 1024;

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
      >
        <input {...getInputProps()} />
        <UploadCloudIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2">Drag & drop files or click to select</p>
        <p className="text-sm text-muted-foreground mt-1">
          Max 10 files (500MB total) - Images: JPG, PNG / Videos: MP4, MOV
        </p>
      </div>

      {acceptedFiles.length > 0 && (
        <div className="space-y-2">
          {acceptedFiles.map((file) => (
            <div key={file.name} className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(1)}MB
              </span>
            </div>
          ))}
          
          <div className="pt-4">
            <Button disabled={isOverLimit}>
              Start Upload
            </Button>
            {isOverLimit && (
              <p className="text-sm text-destructive mt-2">
                Total size exceeds 500MB limit
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 