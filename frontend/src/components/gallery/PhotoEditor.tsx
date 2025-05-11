import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
    RotateCw, 
    RefreshCw, 
    Crop, 
    Sparkles, 
    Palette, 
    Camera, 
    Wand2 
} from 'lucide-react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

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

interface EditSettings {
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

interface PhotoEditorProps {
    photo: Photo;
    editSettings: EditSettings;
    onSettingsChange: (settings: EditSettings) => void;
    onSave: () => void;
    onCancel: () => void;
    isAiProcessing: boolean;
    onAiEnhance: () => void;
    onAiStyleTransfer: (style: string) => void;
}

const PhotoEditor = ({
    photo,
    editSettings,
    onSettingsChange,
    onSave,
    onCancel,
    isAiProcessing,
    onAiEnhance,
    onAiStyleTransfer
}: PhotoEditorProps) => {
    const cropperRef = useRef<any>(null);

    const handleRotate = () => {
        onSettingsChange({ ...editSettings, rotation: (editSettings.rotation + 90) % 360 });
    };

    const handleCrop = () => {
        onSettingsChange({ ...editSettings, isCropping: !editSettings.isCropping });
    };

    const applyCrop = () => {
        if (cropperRef.current) {
            const cropData = cropperRef.current.getData();
            onSettingsChange({
                ...editSettings,
                isCropping: false,
                cropData
            });
        }
    };

    const resetEdits = () => {
        onSettingsChange({
            rotation: 0,
            filter: 'none',
            brightness: 100,
            contrast: 100,
            grayscale: 0,
            sepia: 0,
            saturation: 100,
            isCropping: false,
        });
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    {editSettings.isCropping ? (
                        <Cropper
                            ref={cropperRef}
                            src={photo.url}
                            style={{ height: '100%', width: '100%' }}
                            aspectRatio={1}
                            guides={true}
                            autoCropArea={1}
                            background={false}
                            viewMode={1}
                        />
                    ) : (
                        <img
                            src={photo.url}
                            alt={photo.description}
                            className="object-contain w-full h-full"
                            style={{
                                transform: `rotate(${editSettings.rotation}deg)`,
                                filter: `
                                    ${editSettings.filter} 
                                    brightness(${editSettings.brightness}%)
                                    contrast(${editSettings.contrast}%)
                                    grayscale(${editSettings.grayscale}%)
                                    sepia(${editSettings.sepia}%)
                                    saturate(${editSettings.saturation}%)
                                `,
                            }}
                        />
                    )}
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">AI Enhancements</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                onClick={onAiEnhance}
                                disabled={isAiProcessing}
                                className="flex items-center gap-2"
                            >
                                <Sparkles size={16} />
                                Auto Enhance
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onAiStyleTransfer('vintage')}
                                disabled={isAiProcessing}
                                className="flex items-center gap-2"
                            >
                                <Palette size={16} />
                                Vintage Style
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onAiStyleTransfer('anime')}
                                disabled={isAiProcessing}
                                className="flex items-center gap-2"
                            >
                                <Camera size={16} />
                                Anime Style
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onAiStyleTransfer('sketch')}
                                disabled={isAiProcessing}
                                className="flex items-center gap-2"
                            >
                                <Wand2 size={16} />
                                Sketch Style
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Basic Adjustments</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Brightness</label>
                                <Slider
                                    value={[editSettings.brightness]}
                                    onValueChange={([value]) => onSettingsChange({ ...editSettings, brightness: value })}
                                    min={0}
                                    max={200}
                                    step={1}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contrast</label>
                                <Slider
                                    value={[editSettings.contrast]}
                                    onValueChange={([value]) => onSettingsChange({ ...editSettings, contrast: value })}
                                    min={0}
                                    max={200}
                                    step={1}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Grayscale</label>
                                <Slider
                                    value={[editSettings.grayscale]}
                                    onValueChange={([value]) => onSettingsChange({ ...editSettings, grayscale: value })}
                                    min={0}
                                    max={100}
                                    step={1}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sepia</label>
                                <Slider
                                    value={[editSettings.sepia]}
                                    onValueChange={([value]) => onSettingsChange({ ...editSettings, sepia: value })}
                                    min={0}
                                    max={100}
                                    step={1}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Saturation</label>
                                <Slider
                                    value={[editSettings.saturation]}
                                    onValueChange={([value]) => onSettingsChange({ ...editSettings, saturation: value })}
                                    min={0}
                                    max={200}
                                    step={1}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Tools</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                onClick={handleCrop}
                                className="flex-1"
                            >
                                <Crop size={16} className="mr-2" />
                                {editSettings.isCropping ? 'Apply Crop' : 'Crop'}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleRotate}
                                className="flex-1"
                            >
                                <RotateCw size={16} className="mr-2" />
                                Rotate
                            </Button>

                            <Button
                                variant="outline"
                                onClick={resetEdits}
                                className="flex-1"
                            >
                                <RefreshCw size={16} className="mr-2" />
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    className="px-6"
                >
                    Cancel
                </Button>
                <Button
                    onClick={onSave}
                    className="px-6"
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default PhotoEditor; 