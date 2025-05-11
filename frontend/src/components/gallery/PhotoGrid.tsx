import { Download, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Photo {
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

interface PhotoGridProps {
    photos: Photo[];
    onPhotoClick: (photo: Photo) => void;
    onDownload: (url: string, title: string) => void;
}

const PhotoGrid = ({ photos, onPhotoClick, onDownload }: PhotoGridProps) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {photos.map(photo => (
                <div
                    key={photo.id}
                    className="relative group aspect-square rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-zoom-in bg-muted"
                    onClick={() => onPhotoClick(photo)}
                >
                    <img
                        src={photo.url}
                        alt={photo.description}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        style={{
                            transform: `rotate(${photo.metadata?.rotation || 0}deg)`,
                            filter: photo.metadata?.filter || 'none',
                        }}
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-2 p-4">
                        <p className="text-white text-sm font-medium truncate w-full text-center mb-2">
                            {photo.description}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDownload(photo.url, photo.description);
                                }}
                                className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                            >
                                <Download size={16} className="text-white" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPhotoClick(photo);
                                }}
                                className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                            >
                                <Wand2 size={16} className="text-white" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PhotoGrid; 