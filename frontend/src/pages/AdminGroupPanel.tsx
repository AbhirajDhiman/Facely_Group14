import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  ImagePlus, 
  Loader2, 
  UploadCloud, 
  ImageIcon, 
  Download, 
  Users, 
  Search, 
  UserX, 
  BarChart2,
  FolderPlus,
  Calendar,
  Activity,
  TrendingUp
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import JSZip from 'jszip';
import axios from 'axios';
import { User } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AdminGroupPanelProps {
  groupId: string;
  user: User | null;
  currentGroup: any;
  images: any[];
  getGroupImages: (gId: string) => Promise<void>;
  refreshGroup: () => void;
}

const AdminGroupPanel: React.FC<AdminGroupPanelProps> = ({ 
    groupId, 
    user, 
    currentGroup,
    images,
    getGroupImages,
    refreshGroup
}) => {
  
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isDraggingOverPage, setIsDraggingOverPage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // New state for analytics
  const [memberActivity, setMemberActivity] = useState<any[]>([]);
  const [uploadStats, setUploadStats] = useState<any[]>([]);
  const [storageUsage, setStorageUsage] = useState<any[]>([]);

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    if (!currentGroup || !images) return null;

    // Member activity data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const memberActivityData = last7Days.map(date => ({
      date,
      activeMembers: Math.floor(Math.random() * 10) + 1, // Placeholder data
      newMembers: Math.floor(Math.random() * 3), // Placeholder data
    }));

    // Upload statistics
    const uploadData = last7Days.map(date => ({
      date,
      uploads: Math.floor(Math.random() * 5), // Placeholder data
      totalSize: Math.floor(Math.random() * 1000) + 100, // Placeholder data
    }));

    // Storage usage by type
    const storageData = [
      { name: 'Images', value: images.length * 2.5 },
      { name: 'Documents', value: 0 },
      { name: 'Other', value: 0 },
    ];

    return {
      memberActivity: memberActivityData,
      uploadStats: uploadData,
      storageUsage: storageData,
    };
  }, [currentGroup, images]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (!groupId || selectedFiles.length === 0) {
      toast({
        title: !groupId ? "Group ID missing" : "No files selected",
        description: !groupId ? "Please select a group first." : "Please select image(s) to upload.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('image', file));

    try {
      setUploading(true);
      setUploadProgress(0);
      // Use XMLHttpRequest for progress
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `http://localhost:5001/api/group/${groupId}/upload`, true);
        xhr.withCredentials = true;
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const res = JSON.parse(xhr.responseText);
            if (res.success) {
              toast({ title: "Upload successful", description: "Images uploaded successfully." });
              setOpen(false);
              setSelectedFiles([]);
              getGroupImages(groupId);
              resolve(res);
            } else {
              toast({ title: "Upload failed", description: res.message, variant: "destructive" });
              reject(new Error(res.message));
            }
          } else {
            toast({ title: "Upload failed", description: xhr.statusText, variant: "destructive" });
            reject(new Error(xhr.statusText));
          }
        };
        xhr.onerror = () => {
          toast({ title: "Upload failed", description: "Network error", variant: "destructive" });
          reject(new Error("Network error"));
        };
        xhr.send(formData);
      });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePageDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    // isCreator check is done in GroupDetail before rendering this component
    setIsDraggingOverPage(true);
  }, []);

  const handlePageDragLeave = useCallback((event: DragEvent) => {
    if (event.relatedTarget === null || (event.target as Node)?.ownerDocument?.documentElement === event.relatedTarget) {
        // isCreator check is done in GroupDetail before rendering this component
        setIsDraggingOverPage(false);
    }
  }, []);

  const handlePageDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    // isCreator check is done in GroupDetail before rendering this component
    setIsDraggingOverPage(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        setSelectedFiles(imageFiles);
        setOpen(true);
        toast({
          title: `${imageFiles.length} Image${imageFiles.length > 1 ? 's' : ''} Ready for Upload`,
          description: imageFiles.map(f => f.name).join(', ')
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please drop image files.",
          variant: "destructive",
        });
      }
    }
  }, [getGroupImages]); // Depend on getGroupImages as it's called on successful upload

  useEffect(() => {
    // isCreator check is done in GroupDetail before rendering this component
    document.body.addEventListener('dragover', handlePageDragOver);
    document.body.addEventListener('dragleave', handlePageDragLeave);
    document.body.addEventListener('drop', handlePageDrop);

    return () => {
      document.body.removeEventListener('dragover', handlePageDragOver);
      document.body.removeEventListener('dragleave', handlePageDragLeave);
      document.body.removeEventListener('drop', handlePageDrop);
    };
  }, [handlePageDragOver, handlePageDragLeave, handlePageDrop]);

  const toggleSelect = (id: string) => {
    setSelectedImages(prev =>
      prev.includes(id) ? prev.filter(imgId => imgId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedImages(selectedImages.length === images.length && images.length > 0 ? [] : images.map(img => img._id));
  };

  const downloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.jpg'; // Consider dynamic naming based on url
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSelectedAsZip = async () => {
    if (selectedImages.length === 0) {
      toast({ title: "No images selected", description: "Please select at least one image to download.", variant: "destructive" });
      return;
    }

    const zip = new JSZip();
    const promises = selectedImages.map(async (id) => {
      const image = images.find(img => img._id === id);
      if (image && typeof image.url === 'string') {
        try {
          const response = await fetch(image.url);
          if (!response.ok) throw new Error(`Failed to fetch ${image.url}: ${response.statusText}`);
          const blob = await response.blob();
          const imageName = image.url.substring(image.url.lastIndexOf('/') + 1);
          const filename = imageName || `image-${id}.jpg`;
          zip.file(filename, blob);
        } catch (error) {
            console.error("Error fetching image for zipping:", error);
            toast({
                title: "Download Error",
                description: `Could not download ${image._id}. Skipping.`,
                variant: "destructive"
            });
        }
      }
    });

    await Promise.all(promises);
    if (Object.keys(zip.files).length === 0) {
        toast({
            title: "Download Failed",
            description: "No images could be added to the zip file. This might be due to network issues or invalid image URLs.",
            variant: "destructive"
        });
        return;
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${currentGroup?.name || 'facely-group'}_selected_images.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Download Started", description: "Your ZIP file is being prepared." });
    }).catch(err => {
        console.error("Error generating zip:", err);
        toast({ title: "Zip Generation Failed", description: "Could not create the zip file.", variant: "destructive" });
    });
  };


  return (
    <div className="container mx-auto py-10">
      {isDraggingOverPage && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex flex-col items-center justify-center pointer-events-none">
          <UploadCloud className="w-24 h-24 text-primary animate-bounce" />
          <p className="mt-4 text-2xl font-semibold text-primary-foreground drop-shadow-lg">
            Drop image here to upload
          </p>
        </div>
      )}
      {currentGroup ? (
        <>
          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Images</CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{images.length}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 10)}% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentGroup.members?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 5)} new this week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(images.length * 2.5).toFixed(1)} MB
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.floor((images.length * 2.5) / 100)}% of quota
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Since</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Date(currentGroup.createdAt).toLocaleDateString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.floor((new Date().getTime() - new Date(currentGroup.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days active
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Member Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Member Activity</CardTitle>
                <CardDescription>Daily active members and new joins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData?.memberActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="activeMembers" stroke="#8884d8" name="Active Members" />
                      <Line type="monotone" dataKey="newMembers" stroke="#82ca9d" name="New Members" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Upload Statistics Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Statistics</CardTitle>
                <CardDescription>Daily uploads and total size</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData?.uploadStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <RechartsTooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="uploads" fill="#8884d8" name="Number of Uploads" />
                      <Bar yAxisId="right" dataKey="totalSize" fill="#82ca9d" name="Total Size (MB)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Storage Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Storage Usage</CardTitle>
                <CardDescription>Distribution by content type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData?.storageUsage}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData?.storageUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Card */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions in the group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${i}`} />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          User {i + 1}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {['uploaded', 'joined', 'commented'][Math.floor(Math.random() * 3)]} something
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 24)}h ago
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h3 className="text-xl font-semibold mr-4 text-foreground">Images ({images.length})</h3>
              {images.length > 0 && (
                <>
                  <input
                    type="checkbox"
                    id="selectAllCheckbox"
                    checked={selectedImages.length === images.length && images.length > 0}
                    onChange={toggleSelectAll}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="selectAllCheckbox" className="text-sm text-muted-foreground select-none cursor-pointer">
                    Select All
                  </label>
                </>
              )}
            </div>
            <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSelectedFiles([]); }}>
              <DialogTrigger asChild>
                <Button variant="default">
                  <ImagePlus className="mr-2 h-4 w-4" /> Upload Image
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload New Image{selectedFiles.length > 1 ? 's' : ''}</DialogTitle>
                  <DialogDescription>
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''} selected.`
                      : "Select image files to upload to the group."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 items-center gap-4">
                    {selectedFiles.length === 0 && (
                      <label htmlFor="picture-upload-input" className="w-full cursor-pointer border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary transition-colors">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <span className="mt-2 block text-sm font-medium text-foreground">
                          Click to select or drag & drop images
                        </span>
                        <Input
                          type="file"
                          id="picture-upload-input"
                          className="sr-only"
                          onChange={handleFileSelect}
                          accept="image/*"
                          multiple
                        />
                      </label>
                    )}
                    {selectedFiles.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-24 rounded-md mb-1" />
                            <p className="text-xs text-muted-foreground truncate w-24 text-center">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {uploading && (
                  <div className="w-full mb-2">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-primary transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 text-center">Uploading... {uploadProgress}%</div>
                  </div>
                )}
                <Button onClick={handleUpload} disabled={uploading || selectedFiles.length === 0} className="w-full">
                  {uploading ? <Loader2 className="animate-spin mr-2" /> : <ImagePlus className="mr-2 h-4 w-4" />} 
                  {uploading ? `Uploading... (${uploadProgress}%)` : `Upload ${selectedFiles.length > 1 ? 'Images' : 'Image'}`}
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-20 bg-card border border-border/20 rounded-lg">
              <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" /> 
              <p className="text-xl font-semibold text-foreground">No images yet.</p>
              <p className="text-muted-foreground mt-1">Upload the first image or drag and drop it onto the page!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={image._id}
                  className={`aspect-square relative group rounded-lg overflow-hidden shadow-md transition-all duration-200 hover:shadow-xl cursor-pointer border-2 ${selectedImages.includes(image._id) ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent'}`}
                  onClick={() => toggleSelect(image._id)}
                >
                  <img
                    src={image.url}
                    alt={`Group Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <input
                    type="checkbox"
                    className="absolute top-3 left-3 z-10 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedImages.includes(image._id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelect(image._id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-end">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(image.url);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {images.length > 0 && selectedImages.length > 0 && (
            <div className="mt-8 text-center">
              <Button
                onClick={downloadSelectedAsZip}
                disabled={selectedImages.length === 0}
                size="lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Selected ({selectedImages.length}) as ZIP
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">Group not found or you may not have access.</p>
        </div>
      )}
    </div>
  );
};

export { AdminGroupPanel }; 