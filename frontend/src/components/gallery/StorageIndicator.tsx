import { HardDrive } from 'lucide-react';

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

interface StorageIndicatorProps {
    photos: Photo[];
}

const StorageIndicator = ({ photos }: StorageIndicatorProps) => {
    const totalStorage = 500; // 500 MB total storage
    const usedStorage = photos.reduce((acc, photo) => acc + (photo.sizeInMB || 0), 0);
    const storagePercentage = (usedStorage / totalStorage) * 100;

    const getStorageColor = (percentage: number) => {
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg w-64">
            <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-5 h-5 text-gray-600" />
                <h3 className="font-medium text-gray-700">Storage</h3>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>{usedStorage.toFixed(1)} MB used</span>
                    <span>{totalStorage} MB total</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div 
                        className={`h-full w-full flex-1 transition-all ${getStorageColor(storagePercentage)}`}
                        style={{ width: `${storagePercentage}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500">
                    {storagePercentage >= 90 
                        ? "Storage almost full!" 
                        : storagePercentage >= 70 
                            ? "Storage getting full" 
                            : "Plenty of space left"}
                </p>
            </div>
        </div>
    );
};

export default StorageIndicator; 