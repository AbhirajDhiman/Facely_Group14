import { useState, useRef, useEffect } from 'react';
import { Sparkles, Mic, Stars, Palette, Wand2, Search } from 'lucide-react';
import wooshSound from '../../assets/sounds/woosh-230554.mp3';
import VoiceSearchModal from './VoiceSearchModal';
import { useGallery } from '@/context/GalleryContext';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSearch?: (query: string) => void;
    isSearchFocused: boolean;
    onSearchFocus: (focused: boolean) => void;
}

const SearchBar = ({
    searchQuery,
    onSearchChange,
    onSearch,
    isSearchFocused,
    onSearchFocus
}: SearchBarProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
    const { filterPhotos } = useGallery();

    useEffect(() => {
        audioRef.current = new Audio(wooshSound);
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleFocus = () => {
        onSearchFocus(true);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(error => {
                console.warn('Audio playback failed:', error);
            });
        }
    };

    const handleMicClick = () => {
        setIsVoiceModalOpen(true);
    };

    const handleTranscript = (transcript: string) => {
        onSearchChange(transcript);
        setIsVoiceModalOpen(false);
    };

    const handleSearch = () => {
        const description = searchQuery.trim();
        if (description) {
            if (onSearch) {
                onSearch(description);
            } else {
                filterPhotos(description);
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            <div className="relative mb-8 max-w-3xl mx-auto group">
                <div
                    className={`relative transition-all duration-300 ${
                        isSearchFocused ? 'ring-2 ring-primary ring-opacity-50' : 'hover:ring-1 hover:ring-gray-200'
                    } rounded-2xl bg-background shadow-sm`}
                >
                    <div className="flex items-center px-4 h-14">
                        <div className="flex items-center flex-1">
                            <Sparkles className="w-5 h-5 text-primary mr-3 shrink-0" />
                            <input
                                type="text"
                                placeholder="Ask AI to find photos... or click mic for voice"
                                className="w-full bg-transparent outline-none placeholder:text-muted-foreground text-foreground pr-4"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onFocus={handleFocus}
                                onBlur={() => onSearchFocus(false)}
                                onKeyPress={handleKeyPress}
                            />
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleSearch}
                                    disabled={!searchQuery.trim()}
                                    className={`p-2 rounded-lg transition-all duration-200 ${
                                        searchQuery.trim() 
                                            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                                    }`}
                                    aria-label="Search"
                                >
                                    <Search size={20} />
                                </button>
                                <button
                                    onClick={handleMicClick}
                                    className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors focus:outline-none group/mic-btn"
                                    title="Start voice search"
                                >
                                    <Mic className="w-5 h-5 shrink-0" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* AI Search Overlay */}
                    {isSearchFocused && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-background rounded-xl shadow-2xl border animate-in fade-in zoom-in-95">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <Wand2 className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">AI Photo Search</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Describe what you're looking for using natural language
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <button
                                        className="text-left p-3 rounded-lg border hover:border-primary/30 transition-all"
                                        onClick={() => onSearchChange('photos from last weekend')}
                                    >
                                        <Stars className="w-4 h-4 mb-2 text-primary" />
                                        <p className="font-medium text-sm">Last Weekend</p>
                                        <p className="text-xs text-muted-foreground">"Find memories from Saturday and Sunday"</p>
                                    </button>
                                    <button
                                        className="text-left p-3 rounded-lg border hover:border-primary/30 transition-all"
                                        onClick={() => onSearchChange('landscape images with mountains')}
                                    >
                                        <Palette className="w-4 h-4 mb-2 text-primary" />
                                        <p className="font-medium text-sm">Nature Scenes</p>
                                        <p className="text-xs text-muted-foreground">"Show me mountain landscapes"</p>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-sm border-t pt-4">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <span className="animate-pulse">✨</span> AI-powered search
                                    </span>
                                    <button className="flex items-center gap-2 text-primary hover:text-primary/80">
                                        <span>Advanced filters</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Animated background particles */}
                {isSearchFocused && (
                    <div className="absolute inset-0 -z-10">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${i * 0.2}s`,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <VoiceSearchModal
                isOpen={isVoiceModalOpen}
                onClose={() => setIsVoiceModalOpen(false)}
                onTranscript={handleTranscript}
            />
        </>
    );
};

export default SearchBar;