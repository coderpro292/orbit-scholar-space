
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface FileUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  onFileUploaded?: (filePath: string, fileData: {
    title: string;
    size: number;
    type: string;
    originalName: string;
  }) => void;
  maxFiles?: number;
  className?: string;
}

const FileUploader = ({
  onFilesSelected,
  onFileUploaded,
  maxFiles = 10,
  className,
}: FileUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const newFiles = Array.from(event.target.files);
    addFiles(newFiles);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    if (!event.dataTransfer.files || event.dataTransfer.files.length === 0) return;

    const newFiles = Array.from(event.dataTransfer.files);
    addFiles(newFiles);
  };

  const addFiles = (newFiles: File[]) => {
    // Filter for PDF files only
    const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
    
    // Limit to max files
    const combinedFiles = [...files, ...pdfFiles].slice(0, maxFiles);
    
    setFiles(combinedFiles);
    
    if (onFilesSelected) {
      onFilesSelected(combinedFiles);
    }
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    
    if (onFilesSelected) {
      onFilesSelected(updatedFiles);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload files",
        variant: "destructive",
      });
      return;
    }
    
    setUploadStatus('uploading');
    let successCount = 0;
    let errorCount = 0;
    
    // Process each file
    for (const file of files) {
      try {
        // Create a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user.id}/papers/${fileName}`;
        
        // Upload file to Supabase storage
        const { data, error } = await supabase.storage
          .from('papers')
          .upload(filePath, file, {
            onUploadProgress: (progress) => {
              const percent = (progress.loaded / progress.total) * 100;
              setUploadProgress(prev => ({
                ...prev,
                [file.name]: Math.round(percent),
              }));
            },
          });
        
        if (error) {
          console.error("Error uploading file:", error);
          errorCount++;
          continue;
        }
        
        // If upload was successful and callback is provided
        if (data && onFileUploaded) {
          onFileUploaded(data.path, {
            title: file.name.split('.')[0],
            size: file.size,
            type: file.type,
            originalName: file.name,
          });
        }
        
        successCount++;
      } catch (error) {
        console.error("Exception during upload:", error);
        errorCount++;
      }
    }
    
    // Set final status
    if (errorCount > 0) {
      if (successCount > 0) {
        toast({
          title: "Partial upload success",
          description: `${successCount} files uploaded, ${errorCount} failed`,
          variant: "default",
        });
        setUploadStatus('success');
      } else {
        toast({
          title: "Upload failed",
          description: "All file uploads failed",
          variant: "destructive",
        });
        setUploadStatus('error');
      }
    } else {
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${successCount} files`,
      });
      setUploadStatus('success');
      setFiles([]);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          isDragOver ? "border-primary bg-primary/5" : "border-border",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf"
          multiple
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className={cn(
            "p-4 rounded-full bg-primary/10 text-primary",
            isDragOver && "animate-pulse-subtle"
          )}>
            <Upload className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Drag and drop your PDFs</h3>
            <p className="text-sm text-muted-foreground">
              or click to browse (max {maxFiles} files)
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">
            Selected Files ({files.length}/{maxFiles})
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto rounded-lg border border-border">
            {files.map((file, index) => (
              <div 
                key={`${file.name}-${index}`} 
                className="flex items-center justify-between px-4 py-2 hover:bg-muted/50"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-orbit-500" />
                  <div className="max-w-[200px] sm:max-w-xs overflow-hidden">
                    <p className="truncate text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                {uploadStatus === 'uploading' && uploadProgress[file.name] !== undefined && (
                  <div className="w-16 text-xs text-right mr-2">
                    {uploadProgress[file.name]}%
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  disabled={uploadStatus === 'uploading'}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setFiles([]);
              }}
              disabled={uploadStatus === 'uploading'}
            >
              Clear All
            </Button>
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              disabled={uploadStatus === 'uploading'}
              className="relative"
            >
              {uploadStatus === 'uploading' && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-r-transparent" />
                </span>
              )}
              {uploadStatus === 'error' && <AlertCircle className="mr-2 h-4 w-4" />}
              {uploadStatus === 'success' && <CheckCircle className="mr-2 h-4 w-4" />}
              <span className={cn(uploadStatus === 'uploading' && "opacity-0")}>
                {uploadStatus === 'success' ? 'Uploaded' : 
                 uploadStatus === 'error' ? 'Try Again' : 
                 'Upload'}
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
