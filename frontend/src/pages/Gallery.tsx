import { useState } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StorageIndicator from '@/components/gallery/StorageIndicator';
import PhotoGrid from '@/components/gallery/PhotoGrid';
import PhotoEditor from '@/components/gallery/PhotoEditor';
import SearchBar from '@/components/gallery/SearchBar';
import { useGallery } from '@/context/GalleryContext';

const GalleryPage = () => {
    const {
        photos,
        selectedPhoto,
        editSettings,
        isLoading,
        isAiProcessing,
        searchQuery,
        isSearchFocused,
        setSelectedPhoto,
        setEditSettings,
        setSearchQuery,
        setIsSearchFocused,
        handleDownload,
        saveEdits,
        applyAiEnhancement,
        applyAiStyleTransfer,
        filterPhotos,
    } = useGallery();
    
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (query: string) => {
        setIsSearching(true);
        try {
            await filterPhotos(query);
        } finally {
            setIsSearching(false);
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-lg text-muted-foreground">Loading your gallery...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (photos.length === 0) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-semibold">No Photos Yet</h2>
                        <p className="text-muted-foreground max-w-md">
                            Your gallery is empty. Start by uploading some photos to see them here.
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 relative">
                <h1 className="text-3xl font-bold mb-8">Photo Gallery</h1>
                <StorageIndicator photos={photos} />
                
                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearch={handleSearch}
                    isSearchFocused={isSearchFocused}
                    onSearchFocus={setIsSearchFocused}
                />
                
                <PhotoGrid
                    photos={photos}
                    onPhotoClick={setSelectedPhoto}
                    onDownload={handleDownload}
                />

                {/* Full-screen search loader */}
                {isSearching && (
                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative w-32 h-32">
                                {/* Rotating outer circle */}
                                <div className="absolute inset-0 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
                                
                                {/* Animated bubbles */}
                                {[...Array(12)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="absolute w-3 h-3 bg-primary rounded-full animate-bubble"
                                        style={{
                                            left: `${Math.cos((index * 30 * Math.PI) / 180) * 50}px`,
                                            top: `${Math.sin((index * 30 * Math.PI) / 180) * 50}px`,
                                            animationDelay: `${index * 0.1}s`,
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="text-white text-xl font-medium">Searching your photos...</p>
                            <p className="text-white/70 text-sm">This may take a few moments</p>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Edit Photo</DialogTitle>
                        </DialogHeader>

                        {selectedPhoto && (
                            <PhotoEditor
                                photo={selectedPhoto}
                                editSettings={editSettings}
                                onSettingsChange={setEditSettings}
                                onSave={saveEdits}
                                onCancel={() => setSelectedPhoto(null)}
                                isAiProcessing={isAiProcessing}
                                onAiEnhance={applyAiEnhancement}
                                onAiStyleTransfer={applyAiStyleTransfer}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
};

export default GalleryPage;