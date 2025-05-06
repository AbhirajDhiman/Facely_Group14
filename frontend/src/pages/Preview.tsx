import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  Check, 
  X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface PreviewImage {
  name: string;
  url: string;
}

const Preview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [currentImage, setCurrentImage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [images, setImages] = useState<PreviewImage[]>([]);


  useEffect(() => {
    if (state?.images) {
      setImages(state.images);
    }
  }, [state]);
  
  const handleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map(img => img.url)));
    }
  };
  
  const handleToggleSelect = (url: string) => {
    const newSelected = new Set(selectedImages);
    newSelected.has(url) ? newSelected.delete(url) : newSelected.add(url);
    setSelectedImages(newSelected);
  };

  
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const zip = new JSZip();
      const imgFolder = zip.folder("filtered-images");
      
      // Fetch and add images to zip
      await Promise.all(
        images
          .filter(img => selectedImages.has(img.url))
          .map(async (img) => {
            const response = await fetch(img.url);
            const blob = await response.blob();
            imgFolder?.file(img.name, blob);
          })
      );

      // Generate zip file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "filtered-images.zip");
      
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };
  
  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.url));
    };
  }, [images]);
  
  // Define isCurrentSelected for the current image
  const isCurrentSelected = selectedImages.has(images[currentImage]?.url);
  
  if (!state?.images) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="container mx-auto px-4 py-12">
            <div className="text-center text-xl text-muted-foreground">
              No images to display. Please upload files first.
              <Button className="mt-4" onClick={() => navigate('/upload')}>
                Go to Upload
              </Button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Preview Filtered Images</h1>
                <p className="text-muted-foreground">
                  {images.length} images match your filter
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                <img 
                  src={images[currentImage]?.url} 
                  alt={`Preview ${currentImage + 1}`} 
                  className="max-h-full max-w-full object-contain"
                />
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white border-0 hover:bg-black/70"
                  onClick={handlePrev}
                >
                  <ChevronLeft size={20} />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white border-0 hover:bg-black/70"
                  onClick={handleNext}
                >
                  <ChevronRight size={20} />
                </Button>
                
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <Button
                    variant={isCurrentSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleSelect(images[currentImage]?.url)}
                    className={`${isCurrentSelected ? 'bg-accent text-white' : 'bg-black/50 text-white border-0 hover:bg-black/70'}`}
                  >
                    {isCurrentSelected ? (
                      <>
                        <Check className="h-4 w-4 mr-1" /> Selected
                      </>
                    ) : (
                      'Select'
                    )}
                  </Button>
                </div>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImage + 1} / {images.length}
                </div>
              </div>
            </div>
            
            <div>
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Selected Images</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="selectAll" 
                        checked={selectedImages.size === images.length} 
                        onCheckedChange={handleSelectAll} 
                      />
                      <label 
                        htmlFor="selectAll"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Select All
                      </label>
                    </div>
                  </div>
                  
                  <div className="h-64 overflow-auto mb-6 border rounded-md">
                    {images.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 p-2">
                        {images.map((image) => (
                          <div 
                            key={image.url}
                            className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                              selectedImages.has(image.url) ? 'border-accent' : 'border-transparent'
                            }`}
                            onClick={() => handleToggleSelect(image.url)}
                          >
                            <img 
                              src={image.url} 
                              alt={`Thumbnail ${image.name}`}
                              className="w-full h-full object-cover"
                            />
                            {selectedImages.has(image.url) && (
                              <div className="absolute top-1 right-1 bg-accent rounded-full w-5 h-5 flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        No images to display
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-6">
                    {selectedImages.size} of {images.length} images selected
                  </div>
                  
                  <Button 
                    className="w-full"
                    disabled={selectedImages.size === 0 || isDownloading}
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloading ? 'Downloading...' : 'Download Selected Images'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-6 gap-4 mt-8">
            {images.map((image, index) => (
              <div 
                key={image.url}
                className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                  currentImage === index ? 'border-accent' : 'border-transparent'
                } ${selectedImages.has(image.url) ? 'ring-2 ring-accent ring-offset-2' : ''}`}
                onClick={() => setCurrentImage(index)}
              >
                <img 
                  src={image.url} 
                  alt={`Thumbnail ${image.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Preview;
