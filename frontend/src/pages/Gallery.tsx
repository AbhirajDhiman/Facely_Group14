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
    } = useGallery();

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
                    isSearchFocused={isSearchFocused}
                    onSearchFocus={setIsSearchFocused}
                />
                
                <PhotoGrid
                    photos={photos}
                    onPhotoClick={setSelectedPhoto}
                    onDownload={handleDownload}
                />

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