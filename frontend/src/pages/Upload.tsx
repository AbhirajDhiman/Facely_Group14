import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/ui/empty-state';
import { Upload as UploadIcon, Image, CheckCircle } from 'lucide-react';
import DragDropUpload from '@/components/upload/DragDropUpload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import JSZip from 'jszip';
import axios from 'axios';
import FormData from "form-data";
import { compareEmbeddings } from '@/context/faceRecognition';

async function zipToFiles(zipFile: File): Promise<File[]> {
  const jsZip = new JSZip();
  const zipData = await jsZip.loadAsync(zipFile);
  const files: File[] = [];

  const filePromises: Promise<void>[] = [];
  zipData.forEach((relativePath, zipEntry) => {
    if (!zipEntry.dir && 
        !relativePath.startsWith('__MACOSX/') && 
        !relativePath.includes('.DS_Store') &&
        isImageFile(zipEntry.name)) {
      filePromises.push(
        zipEntry.async('blob').then((fileData) => {
          const file = new File([fileData], zipEntry.name, {
            type: getMimeType(zipEntry.name),
          });
          files.push(file);
        })
      );
    }
  });

  await Promise.all(filePromises);
  return files;
}

function isImageFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
}

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    default: return 'application/octet-stream';
  }
}

const Upload = () => {
  const { user } = useAuth();
  const [uploadMethod, setUploadMethod] = useState('reference');
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [leftFiles, setLeftFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const handleZipFile = async (file: File) => {
    try {
      const extractedFiles = await zipToFiles(file);
      setLeftFiles(extractedFiles);
    } catch (error) {
      console.error('Error processing zip file:', error);
      // Handle error state here
    }
  };

  const handleSubmit = async () => {
    if (leftFiles.length === 0) return;
  
    setIsSubmitting(true);
    setProgress(0);
  
    try {
      // Prepare reference embedding
      let referenceEmbedding = [];
  
      if (uploadMethod === 'reference' && referenceFile) {
        const formData = new FormData();
        formData.append('image', referenceFile);
        const response = await axios.post('http://127.0.0.1:8000/make-embedding', formData);
        referenceEmbedding = response.data.embedding;
      } else if (user?.faceEmbedding) {
        referenceEmbedding = user.faceEmbedding;
      } else {
        throw new Error('No reference image available');
      }
  
      // Prepare form data with all images and reference embedding
      const formData = new FormData();
      leftFiles.forEach(file => {
        formData.append('images', file);
      });
      formData.append('referenceEmbedding', JSON.stringify(referenceEmbedding));
  
      // Send request to find matches
      const response = await axios.post('http://127.0.0.1:8000/find-matches', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
  
      const matchingIndices = response.data.matchingIndices;
  
      // Filter matching files based on indices
      const matchingFiles = matchingIndices.map(index => ({
        name: leftFiles[index].name,
        url: URL.createObjectURL(leftFiles[index])
      }));
  
      setIsSuccess(true);
      navigate('/preview', {
        state: {
          images: matchingFiles,
          count: matchingFiles.length
        }
      });
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  if (isSuccess) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="container mx-auto px-4 py-12">
            <EmptyState
              icon={<CheckCircle size={48} className="text-green-500" />}
              title="Upload Successful!"
              description="Your files have been uploaded successfully. We're processing the images and will redirect you to the preview page momentarily..."
            />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Upload and Filter Images</h1>
            <p className="text-muted-foreground">
              Upload a ZIP file containing images and choose a reference image to filter them
            </p>
          </div>
          
          <div className="grid md:grid-cols-7 gap-8">
            <div className="md:col-span-5">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Images</CardTitle>
                  <CardDescription>
                    Select a ZIP file containing the images you want to filter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DragDropUpload
                    onFileSelect={handleZipFile}
                    accept=".zip,.rar,.7z"
                    label="Drag & drop your ZIP file or click to upload"
                    className="mb-6"
                  />
                  
                  {leftFiles.length > 0 && (
                    <div className="mb-4 text-sm text-muted-foreground">
                      {leftFiles.length} images found in the archive
                    </div>
                  )}
                  
                  <div className="mt-8">
                    <Label className="text-base">Choose Reference Image</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select how you want to filter the images
                    </p>
                    
                    <RadioGroup 
                      value={uploadMethod} 
                      onValueChange={setUploadMethod}
                      className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    >
                      <div className={`flex items-start space-x-2 border rounded-md p-4 ${uploadMethod === 'profile' ? 'border-accent' : 'border-input'}`}>
                        <RadioGroupItem value="profile" id="profile" className="mt-1" />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="profile" className="text-base font-medium mb-2">Use Profile Picture</Label>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user?.profilePic} alt={user?.name} />
                              <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
                            </Avatar>
                            <p className="text-sm text-muted-foreground">
                              Filter images using your current profile picture
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`flex items-start space-x-2 border rounded-md p-4 ${uploadMethod === 'reference' ? 'border-accent' : 'border-input'}`}>
                        <RadioGroupItem value="reference" id="reference" className="mt-1" />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="reference" className="text-base font-medium mb-2">Upload Reference Image</Label>
                          <p className="text-sm text-muted-foreground mb-2">
                            Upload a specific image to use as reference
                          </p>
                          
                          {uploadMethod === 'reference' && (
                            <DragDropUpload
                              onFileSelect={setReferenceFile}
                              accept="image/*"
                              label="Select reference image"
                              className="mt-2"
                            />
                          )}
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  {isSubmitting && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Processing {progress.toFixed(0)}%...
                      </span>
                    </div>
                  )}
                  <Button
                    onClick={handleSubmit}
                    disabled={leftFiles.length === 0 || (uploadMethod === 'reference' && !referenceFile) || isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Upload and Filter'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      1
                    </div>
                    <p>Upload a ZIP file containing all the images you want to filter</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      2
                    </div>
                    <p>Choose a reference image or use your profile picture</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      3
                    </div>
                    <p>Our AI will find all images containing faces that match the reference</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      4
                    </div>
                    <p>Review and download the filtered images</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Upload;