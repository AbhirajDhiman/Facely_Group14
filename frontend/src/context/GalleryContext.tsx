import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

// Types
export interface Photo {
    id: string;
    url: string;
    description: string;
    date: string;
    sizeInMB: number;
    metadata?: {
        rotation?: number;
        filter?: string;
        crop?: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    };
}

export interface EditSettings {
    rotation: number;
    filter: string;
    brightness: number;
    contrast: number;
    grayscale: number;
    sepia: number;
    saturation: number;
    isCropping: boolean;
    cropData?: any;
}

interface GalleryContextType {
    photos: Photo[];
    selectedPhoto: Photo | null;
    editSettings: EditSettings;
    isLoading: boolean;
    isAiProcessing: boolean;
    searchQuery: string;
    isSearchFocused: boolean;
    setSelectedPhoto: (photo: Photo | null) => void;
    setEditSettings: (settings: EditSettings) => void;
    setSearchQuery: (query: string) => void;
    setIsSearchFocused: (focused: boolean) => void;
    handleDownload: (url: string, title: string) => Promise<void>;
    saveEdits: () => void;
    applyAiEnhancement: () => Promise<void>;
    applyAiStyleTransfer: (style: string) => Promise<void>;
    refreshGallery: () => Promise<void>;
    filterPhotos: (query: string) => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function GalleryProvider({ children }: { children: ReactNode }) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [editSettings, setEditSettings] = useState<EditSettings>({
        rotation: 0,
        filter: 'none',
        brightness: 100,
        contrast: 100,
        grayscale: 0,
        sepia: 0,
        saturation: 100,
        isCropping: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isAiProcessing, setIsAiProcessing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const refreshGallery = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("http://localhost:5001/api/gallery/gallery-pictures");
            setPhotos(response.data.gallery);
            console.log("photos", photos);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load gallery photos");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshGallery();
    }, []);

    const handleDownload = async (url: string, title: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${title}-download.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            toast.success("Download started!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to download image");
        }
    };

    const saveEdits = () => {
        if (selectedPhoto) {
            setPhotos(prev => prev.map(photo =>
                photo.id === selectedPhoto.id
                    ? { ...photo, metadata: { ...editSettings } }
                    : photo
            ));
            setSelectedPhoto(null);
            toast.success("Changes saved successfully!");
        }
    };

    const applyAiEnhancement = async () => {
        if (!selectedPhoto) return;
        try {
            setIsAiProcessing(true);
            // TODO: Implement AI enhancement API call
            toast.success("AI enhancement applied!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to apply AI enhancement");
        } finally {
            setIsAiProcessing(false);
        }
    };

    const applyAiStyleTransfer = async (style: string) => {
        if (!selectedPhoto) return;
        try {
            setIsAiProcessing(true);
            // TODO: Implement AI style transfer API call
            toast.success(`Applied ${style} style!`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to apply style transfer");
        } finally {
            setIsAiProcessing(false);
        }
    };

    const filterPhotos = async (query: string)=>{
        try{
            const response = await axios.post('http://localhost:5001/api/gallery/filter-photos', {photos, query})
            console.log("response", response.data);
            setPhotos(response.data.filteredPhotos);
        }catch(error){
            console.error(error);
            toast.error("Failed to filter photos");
        }
    }

    const value = {
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
        refreshGallery,
        filterPhotos,
    };

    return (
        <GalleryContext.Provider value={value}>
            {children}
        </GalleryContext.Provider>
    );
}

export function useGallery() {
    const context = useContext(GalleryContext);
    if (context === undefined) {
        throw new Error('useGallery must be used within a GalleryProvider');
    }
    return context;
} 