import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Image, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DragDropUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  className?: string;
  previewUrl?: string;
}

const DragDropUpload = ({
  onFileSelect,
  accept = 'image/*',
  maxSize = 5, // Default 5MB
  label = 'Drag & drop or click to upload',
  className,
  previewUrl
}: DragDropUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    setError(null);
    
    // Skip validation for zip files
    if (accept.includes('zip') && file.name.endsWith('.zip')) {
      return true;
    }
    
    // Check file type
    if (!file.type.match(accept.replace('*', ''))) {
      setError(`File must be an ${accept.replace('/*', '')} file.`);
      return false;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB.`);
      return false;
    }
    
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
      
      // Create preview only for images (not for zip files)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemovePreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      
      {!preview ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer text-center',
            isDragging ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50 hover:bg-accent/5',
            className
          )}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
              <Upload size={24} />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-lg">{label}</p>
              <p className="text-sm text-muted-foreground">
                {accept.includes('image') ? 'PNG, JPG or GIF' : accept.replace('/*', ' files')} up to {maxSize}MB
              </p>
            </div>
            <Button variant="outline" type="button" className="mt-2">
              Select File
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative border rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleRemovePreview}
              className="bg-background/80 backdrop-blur-sm hover:bg-background"
            >
              <X size={18} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-background/80 backdrop-blur-sm hover:bg-background text-green-500"
            >
              <Check size={18} />
            </Button>
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
};

export default DragDropUpload;