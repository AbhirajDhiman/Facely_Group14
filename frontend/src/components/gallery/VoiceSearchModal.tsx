import { useState, useEffect, useRef } from 'react';
import { Mic, X, Search } from 'lucide-react';

// Re-declare SpeechRecognition types for this component
interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}
interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
}
interface SpeechRecognitionStatic {
    new(): SpeechRecognition;
}
interface SpeechRecognition extends EventTarget {
    grammars: any;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    serviceURI: string;
    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    abort(): void;
    start(): void;
    stop(): void;
}
// Extend the Window interface for global SpeechRecognition types
declare global {
    interface Window {
        SpeechRecognition?: SpeechRecognitionStatic;
        webkitSpeechRecognition?: SpeechRecognitionStatic;
    }
}

interface VoiceSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTranscript: (transcript: string) => void;
}

const VoiceSearchModal = ({ isOpen, onClose, onTranscript }: VoiceSearchModalProps) => {
    const [isListening, setIsListening] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const [statusText, setStatusText] = useState("Click the mic to start speaking");
    const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
    const modalContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            // Ensure microphone stops if modal is closed externally
            if (isListening && speechRecognitionRef.current) {
                speechRecognitionRef.current.stop();
            }
            setIsListening(false);
            return;
        }
        
        // Initialize Speech Recognition when modal is opened
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            setMicError("Speech recognition not supported in this browser.");
            setStatusText("Speech recognition not supported.");
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = true; // Get interim results for dynamic feedback
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setMicError(null);
            setStatusText("Listening...");
        };

        recognition.onend = () => {
            setIsListening(false);
            // If no final transcript was processed and error is not set, imply it ended.
            if (statusText === "Listening...") {
                 setStatusText("Processing complete. Click mic to speak again.");
            }
             // Automatically close if not an error state that requires user attention
            if (!micError && statusText !== "Processing complete. Click mic to speak again." && statusText !== "No speech detected. Try again.") {
               // onClose(); // Consider if auto-close is desired or if user should explicitly close
            }
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            
            if (interimTranscript) {
                setStatusText(interimTranscript);
            }

            if (finalTranscript) {
                const trimmedTranscript = finalTranscript.trim();
                if (trimmedTranscript) {
                    setStatusText(`Recognized: "${trimmedTranscript}"`);
                    onTranscript(trimmedTranscript);
                    setTimeout(onClose, 1500); // Close after showing recognized text
                } else {
                     setStatusText("No speech detected. Try again.");
                }
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error:", event.error);
            let errorMsg = `An error occurred: ${event.error}`;
            if (event.error === 'no-speech') {
                errorMsg = "No speech detected. Please try again.";
            } else if (event.error === 'audio-capture') {
                errorMsg = "Audio capture failed. Check microphone and permissions.";
            } else if (event.error === 'not-allowed') {
                errorMsg = "Microphone access denied. Enable it in browser settings.";
            } else if (event.error === 'network') {
                 errorMsg = "Network error. Check connection.";
            }
            setMicError(errorMsg);
            setStatusText(errorMsg);
            setIsListening(false);
        };

        speechRecognitionRef.current = recognition;
        
        // Auto-start listening when modal opens, if desired
        // handleMicClick(); // Or require an explicit click

        return () => {
            if (speechRecognitionRef.current) {
                speechRecognitionRef.current.abort();
                speechRecognitionRef.current.onstart = null;
                speechRecognitionRef.current.onend = null;
                speechRecognitionRef.current.onresult = null;
                speechRecognitionRef.current.onerror = null;
                speechRecognitionRef.current = null;
            }
        };
    }, [isOpen, onTranscript, onClose]); // Rerun when isOpen changes

    // Close modal if clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);


    const handleMicClick = () => {
        if (!speechRecognitionRef.current) {
            const msg = "Speech recognition not initialized or not supported.";
            setMicError(msg);
            setStatusText(msg);
            return;
        }

        if (isListening) {
            speechRecognitionRef.current.stop();
            // Status will be updated by onend or onerror
        } else {
            setMicError(null);
            setStatusText("Initializing...");
            try {
                speechRecognitionRef.current.start();
            } catch (e: any) {
                console.error("Error starting speech recognition:", e);
                const errMsg = `Mic start failed: ${e.message}. Check permissions.`;
                setMicError(errMsg);
                setStatusText(errMsg);
                setIsListening(false);
            }
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div 
                ref={modalContentRef}
                className="bg-background rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden border border-primary/20"
                // Add a style for the animated border later
            >
                {/* ChatGPT-like Animated Border Placeholder - to be implemented with SVG/CSS */}
                <div className="absolute inset-0 pointer-events-none animated-border-container">
                    {/* Example: Multiple divs for a wave effect - this will be refined */}
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-2xl border-2 border-primary opacity-0 animate-wave"
                            style={{
                                animationDelay: `${i * 0.5}s`,
                                // The animation 'wave' will be defined in CSS
                            }}
                        />
                    ))}
                </div>

                <div className="p-6 sm:p-8 relative z-10">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close voice search"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col items-center justify-center space-y-6 pt-8 pb-4">
                        <div className="relative">
                            <button
                                onClick={handleMicClick}
                                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out
                                            ${isListening ? 'bg-primary/20 scale-110' : 'bg-accent hover:bg-primary/10'}
                                            text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 relative group
                                `}
                                aria-label={isListening ? "Stop listening" : "Start listening"}
                            >
                                <Mic size={48} className={`transition-transform duration-200 ${isListening ? 'scale-110' : ''}`} />
                                {isListening && (
                                    <>
                                        {/* Pulsing listening indicator */}
                                        <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse opacity-75 group-hover:opacity-100"></span>
                                        {/* More sophisticated waves could go here or around the modal itself */}
                                    </>
                                )}
                            </button>
                             {/* Simple circle burst for listening - can be replaced with border wave */}
                            {isListening && (
                                <div className="absolute inset-[-10px] border-2 border-primary/30 rounded-full animate-ping-slow opacity-50"></div>
                            )}
                        </div>

                        <p className={`text-center text-sm min-h-[40px] px-4 ${micError ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {statusText}
                        </p>
                    </div>
                </div>
            </div>
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes wave {
                    0% { transform: scale(0.95); opacity: 0.5; border-color: hsl(var(--primary) / 0.5); }
                    50% { transform: scale(1.05); opacity: 0.2; border-color: hsl(var(--primary) / 0.2); }
                    100% { transform: scale(0.95); opacity: 0; border-color: hsl(var(--primary) / 0); }
                }
                @keyframes ping-slow {
                    75%, 100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }
                .animated-border-container > div {
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
                .animate-wave { 
                    animation-name: wave;
                    animation-duration: 2s; /* Slower, more subtle wave */
                    animation-iteration-count: infinite;
                    animation-timing-function: ease-in-out;
                    /* Start with full size of parent */
                    width: 100%; 
                    height: 100%;
                    top: 0;
                    left: 0;
                    position: absolute; /* Ensure it's positioned correctly within the container */
                }
                `}
            </style>
        </div>
    );
};

export default VoiceSearchModal; 