import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useGroup } from '@/context/GroupContext';
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
import { Copy, ImagePlus, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { API_BASE_URL } from '@/config/config';
import JSZip from 'jszip';
import { useAuth } from '@/context/AuthContext';

const triggerElementClick = (element) => {
  if (element && 'click' in element) {
    element.click();
  }
};

const GroupDetail = () => {
  const { groupId } = useParams();
  const {user} = useAuth();
  const { currentGroup, getGroupInfo, getGroupImages, uploadGroupImage, loading } = useGroup();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (groupId) {
      getGroupInfo(groupId);
      fetchImages(groupId);
      if(currentGroup?.creator?._id === user?._id){
        setIsCreator(true);
      }
    }
  }, []);

  const fetchImages = async (groupId) => {
    try {
      const res = await getGroupImages(groupId);
      if (res.success) {
        setImages(res.images);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async () => {
    if (!groupId || !selectedFile) {
      toast({
        title: !groupId ? "Group ID missing" : "No file selected",
        description: !groupId ? "Please select a group first." : "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setUploading(true);
      const res = await uploadGroupImage(groupId, formData);
      if (res.success) {
        toast({ title: "Upload successful", description: "Image uploaded successfully." });
        setOpen(false);
        setSelectedFile(null);
        fetchImages(groupId);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

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

  const toggleSelect = (id) => {
    setSelectedImages(prev =>
      prev.includes(id) ? prev.filter(imgId => imgId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedImages(selectedImages.length === images.length ? [] : images.map(img => img._id));
  };

  const downloadImage = (url) => {
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
      if (image) {
        const response = await fetch(image.url);
        const blob = await response.blob();
        zip.file(`image-${id}.jpg`, blob);
      }
    });

    await Promise.all(promises);
    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'selected_images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto text-center py-20">
          <Loader2 className="inline-block animate-spin mr-2" /> Loading group info...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        {currentGroup ? (
          <>
            <div className="mb-8 p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
              <h2 className="text-3xl font-bold mb-4">{currentGroup.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Created by: {currentGroup.creator.name}
              </p>
              <div className="mt-4">
                <Button onClick={handleCopyInviteCode} variant="secondary" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Invite Code
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <p className="text-lg font-semibold mr-4">Images ({images.length})</p>
                <input
                  type="checkbox"
                  checked={selectedImages.length === images.length}
                  onChange={toggleSelectAll}
                  className="mr-2"
                />
                <label className="text-sm">Select All</label>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                {
                  isCreator?
                  <Button variant="outline">
                    <ImagePlus className="mr-2 h-4 w-4" /> Upload Image
                  </Button>:
                  ""
                }
                  
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Upload Image</DialogTitle>
                    <DialogDescription>
                      Select an image from your computer to upload to the group.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="picture" className="text-right font-medium">
                        Image
                      </label>
                      <Input
                        type="file"
                        id="picture"
                        className="col-span-3"
                        onChange={handleFileSelect}
                      />
                    </div>
                  </div>
                  <Button onClick={handleUpload} disabled={uploading}>
                    {uploading ? <Loader2 className="animate-spin mr-2" /> : null}
                    Upload
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            {images.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No images found in this group.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((image, index) => (
                  <div
                    key={image._id}
                    className={`aspect-square relative group rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                      selectedImages.includes(image._id) ? 'border-2 border-blue-500' : ''
                    } group-hover:shadow-xl`}
                  >
                    <img
                      src={image.url}
                      alt={`Group Image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <input
                      type="checkbox"
                      className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      checked={selectedImages.includes(image._id)}
                      onChange={() => toggleSelect(image._id)}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => downloadImage(image.url)}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {images.length > 0 && (
              <div className="mt-6 text-center">
                <Button
                  onClick={downloadSelectedAsZip}
                  disabled={selectedImages.length === 0}
                  className="transition-colors duration-200"
                >
                  Download Selected ({selectedImages.length}) as ZIP
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Group not found.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GroupDetail;