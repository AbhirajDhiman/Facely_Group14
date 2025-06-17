import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
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
import { Copy, ImagePlus, Loader2, UploadCloud } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import JSZip from 'jszip';
import { useAuth, AuthProvider } from '@/context/AuthContext';
import { ImageIcon } from 'lucide-react';
import { Download } from 'lucide-react';
import axios from 'axios';
import { AdminGroupPanel } from './AdminGroupPanel';


const triggerElementClick = (element) => {
  if (element && 'click' in element) {
    element.click();
  }
};

const GroupDetail = () => {
  const { groupId } = useParams();
  const {user} = useAuth();
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isDraggingOverPage, setIsDraggingOverPage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<any>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);

  
  const getGroupInfo = useCallback(async (gId: string) => {
    if (!gId) return;
    try {
      setLoading(true);
      const url = `http://localhost:5001/api/group/${gId}/info`;
      const res = await axios.get(url);
      if (res.data.success) {
        setCurrentGroup(res.data.group);
        setGroupMembers(res.data.group.members);
        setIsMember(res.data.group.members.some(member => member._id === user?._id));
        console.log("groupMembers", groupMembers);
        console.log("isMember", isMember);
        if (user) {
          setIsCreator(res.data.group.creator._id === user?._id);
          console.log("isCreator (in getGroupInfo):", res.data.group.creator._id === user?._id);
        } else {
          setIsCreator(false);
        }
      }
    } catch (error: any) {
      toast({
        title: "Failed to fetch group info",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast, setLoading, setCurrentGroup, setIsCreator]);

  const getGroupImages = useCallback(async (gId: string) => {
    if (!gId) return;
    try {
      setLoading(true);
      const url = `http://localhost:5001/api/group/${gId}/images`;
      const res = await axios.get(url);
      if(res.data.success){
        setImages(res.data.images);
      }
    } catch (error: any) {
      toast({
        title: "Failed to fetch images",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, setLoading, setImages]);

  useEffect(() => {
    if (groupId && user) {
      getGroupInfo(groupId);
      getGroupImages(groupId);
    } else if (groupId && !user) {
      getGroupInfo(groupId);
      getGroupImages(groupId);
      console.log("useEffect: groupId present, user is null, fetching group info anyway");
    }
  }, [groupId, user, getGroupInfo, getGroupImages]);


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
    if (isCreator && user) {
      setIsDraggingOverPage(true);
    }
  }, [isCreator, user]);

  const handlePageDragLeave = useCallback((event: DragEvent) => {
    if (event.relatedTarget === null || (event.target as Node)?.ownerDocument?.documentElement === event.relatedTarget) {
        if (isCreator && user) {
            setIsDraggingOverPage(false);
        }
    }
  }, [isCreator, user]);

  const handlePageDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    if (isCreator && user) {
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
    }
  }, [isCreator, user, getGroupImages]);

  useEffect(() => {
    if (isCreator && user) {
      document.body.addEventListener('dragover', handlePageDragOver);
      document.body.addEventListener('dragleave', handlePageDragLeave);
      document.body.addEventListener('drop', handlePageDrop);
    }

    return () => {
      if (isCreator && user) {
        document.body.removeEventListener('dragover', handlePageDragOver);
        document.body.removeEventListener('dragleave', handlePageDragLeave);
        document.body.removeEventListener('drop', handlePageDrop);
      }
    };
  }, [isCreator, user, handlePageDragOver, handlePageDragLeave, handlePageDrop]);


  const handleCopyInviteCode = () => {
    if (currentGroup?.inviteCode) {
      navigator.clipboard.writeText(currentGroup.inviteCode)
        .then(() => toast({ title: "Invite code copied", description: "Invite code copied to clipboard." }))
        .catch(err => {
          toast({ title: "Copy failed", description: "Failed to copy invite code.", variant: "destructive" });
          console.error("Could not copy invite code: ", err);
        });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedImages(prev =>
      prev.includes(id) ? prev.filter(imgId => imgId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedImages(selectedImages.length === images.length ? [] : images.map(img => img._id));
  };

  const downloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.jpg';
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

  if (loading && !currentGroup) {
    return (
      <Layout>
        <div className="container mx-auto text-center py-20 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Loader2 className="animate-spin mr-3 h-8 w-8 text-primary" /> 
          <span className="text-xl text-muted-foreground">Loading Group Details...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {isCreator ? (
        <AdminGroupPanel 
          groupId={groupId}
          user={user}
          currentGroup={currentGroup}
          images={images}
          getGroupImages={getGroupImages}
          refreshGroup={() => getGroupInfo(groupId!)}
        />
      ) : (
        <div className="container mx-auto py-10">
          {currentGroup ? (
            <>
              <div className="mb-8 p-6 rounded-lg shadow-lg bg-card border border-border/20">
                <h2 className="text-3xl font-bold mb-2 text-card-foreground">{currentGroup.name}</h2>
                <p className="text-muted-foreground mb-1">
                  Created by: <span className="font-medium text-foreground">{currentGroup.creator.name}</span>
                </p>
                {currentGroup.members && (
                   <p className="text-sm text-muted-foreground">
                     Members: {currentGroup.members.length}
                   </p>
                )}
                <div className="mt-4 flex items-center gap-2">
                  <Input 
                    type="text" 
                    readOnly 
                    value={currentGroup.inviteCode} 
                    className="bg-muted border-border/30 text-muted-foreground focus-visible:ring-primary/50 text-sm p-2 h-9 w-auto inline-flex max-w-[200px]"
                  />
                  <Button onClick={handleCopyInviteCode} variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Code
                  </Button>
                </div>
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
                {
                  isCreator && user && (
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
                  )
                }
              </div>

              {images.length === 0 ? (
                <div className="text-center py-20 bg-card border border-border/20 rounded-lg">
                  <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" /> 
                  <p className="text-xl font-semibold text-foreground">No images yet.</p>
                  <p className="text-muted-foreground mt-1">{currentGroup && currentGroup.creator._id !== user?._id ? "The group creator hasn't added any images." : "Login to upload images or check your permissions."}</p>
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
            !loading && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">Group not found or you may not have access.</p>
              </div>
            )
          )}
        </div>
      )}
    </Layout>
  );
};

export default GroupDetail;