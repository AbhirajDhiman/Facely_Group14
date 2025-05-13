import { useState, useEffect, useRef } from 'react';
import { Bot, X, Mic, Send, Loader2, CornerDownLeft, ChevronUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Placeholder for Gemini API call - replace with your actual implementation
// const askGeminiForNavigation = async (command: string, currentPath: string, availableRoutes: string[]): Promise<{ route?: string; reply: string }> => {
//     console.log('Sending to Gemini:', { command, currentPath, availableRoutes });
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     if (command.toLowerCase().includes('gallery')) {
//         return { route: '/gallery', reply: 'Okay, taking you to the gallery!' };
//     }
//     if (command.toLowerCase().includes('profile')) {
//         return { route: '/profile', reply: 'Sure, let\'s go to your profile.' };
//     }
//     if (command.toLowerCase().includes('dashboard')) {
//         return { route: '/dashboard', reply: 'Navigating to your dashboard.' };
//     }
//     return { reply: 'I\'m not sure how to help with that yet, but I\'m learning!' };
// };


interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const AiFacelyChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Define available routes for navigation commands
    const availableRoutes = ['/', '/signin', '/signup', '/verify-email', '/forgot-password', '/reset-password/:token', '/dashboard', '/group/:groupId', '/upload', '/preview', '/contact', '/gallery', '/profile'];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            // Add initial greeting from AI when chat opens
            if (messages.length === 0) {
                 setMessages([
                    { id: 'initial-greeting', text: 'Hi there! I\'m AI Facely. How can I help you navigate today?', sender: 'ai', timestamp: new Date() }
                ]);
            }
        }
    }, [isOpen]);

    const handleToggleChat = () => {
        setIsOpen(prev => !prev);
    };

    const handleSendMessage = async () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) return;

        const newUserMessage: Message = {
            id: `user-${Date.now()}`,
            text: trimmedInput,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // const { route, reply } = await askGeminiForNavigation(trimmedInput, location.pathname, availableRoutes);
            // For now, using a placeholder for Gemini response
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
            let reply = 'I am still under development. Navigation commands will be active soon!';
            let route: string | undefined = undefined;

            const command = trimmedInput.toLowerCase();
            if (command.includes('gallery') || command.includes('show photos')) {
                route = '/gallery';
                reply = 'Okay, navigating to your photo gallery!';
            } else if (command.includes('profile') || command.includes('my page')) {
                route = '/profile';
                reply = 'Sure, heading to your profile page.';
            } else if (command.includes('dashboard') || command.includes('home screen')) {
                route = '/dashboard';
                reply = 'Alright, taking you to the dashboard.';
            } else if (command.includes('upload') || command.includes('add new pictures')) {
                 route = '/upload';
                reply = 'Let\'s go to the upload page!';
            }


            const aiResponse: Message = {
                id: `ai-${Date.now()}`,
                text: reply,
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiResponse]);

            if (route) {
                toast.info(`AI Facely: ${reply}`);
                navigate(route);
                setIsOpen(false); // Optionally close chat on navigation
            }
        } catch (error) {
            console.error('Error processing command:', error);
            const errorResponse: Message = {
                id: `ai-error-${Date.now()}`,
                text: 'Sorry, I encountered an error. Please try again.',
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };
    
    const handleVoiceInput = () => {
        if (isListening) {
            setIsListening(false);
            // @ts-ignore
            window.speechRecognition?.stop();
            return;
        }

        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error('Speech recognition is not supported in your browser.');
            return;
        }

        // @ts-ignore
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            toast.info('AI Facely is listening...');
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(transcript);
            // Optional: automatically send message after voice input
            // handleSendMessage(); 
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'no-speech') {
                toast.warning('No speech detected. Please try again.');
            } else if (event.error === 'audio-capture') {
                toast.error('Microphone error. Please check your microphone settings.');
            } else {
                toast.error('Speech recognition failed. Please try again.');
            }
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
         // @ts-ignore
        window.speechRecognition = recognition; // Store on window to allow stopping
    };


    return (
        <>
            {/* FAB to toggle chat */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.5 }}
                        transition={{ duration: 0.3, ease: 'circOut' }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <Button
                            onClick={handleToggleChat}
                            size="lg"
                            className="rounded-full shadow-2xl w-16 h-16 bg-gradient-to-br from-primary to-accent-foreground hover:from-primary/90 hover:to-accent-foreground/90 transform transition-all duration-200 hover:scale-110 focus:ring-4 focus:ring-primary/50"
                            aria-label="Open AI Facely Chat"
                        >
                            <Bot className="w-8 h-8" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        transition={{ duration: 0.4, ease: 'circOut' }}
                        className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:max-w-md"
                    >
                        <Card className="h-[70vh] sm:h-[600px] flex flex-col bg-background/80 backdrop-blur-xl shadow-2xl border-primary/30 overflow-hidden rounded-t-2xl sm:rounded-2xl">
                            <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-6 h-6 text-primary animate-pulse" />
                                    <CardTitle className="text-lg font-semibold text-foreground">AI Facely</CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleToggleChat} aria-label="Close chat">
                                    <ChevronUp className="w-6 h-6 text-muted-foreground transform transition-transform duration-300 group-hover:rotate-180" />
                                </Button>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[75%] p-3 rounded-xl ${
                                            msg.sender === 'user' 
                                                ? 'bg-primary text-primary-foreground rounded-br-none' 
                                                : 'bg-muted text-muted-foreground rounded-bl-none'
                                        }`}>
                                            <p className="text-sm">{msg.text}</p>
                                            <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                                <div ref={messagesEndRef} />
                            </CardContent>
                            <div className="p-4 border-t border-border/50 bg-background/50">
                                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                                    <Input
                                        ref={inputRef}
                                        type="text"
                                        placeholder={isListening ? "Listening..." : "Ask AI Facely to navigate..."}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="flex-1 bg-transparent border-border/60 focus-visible:ring-primary/50"
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="button"
                                        variant={isListening ? "destructive" : "outline"}
                                        size="icon"
                                        onClick={handleVoiceInput}
                                        disabled={isLoading}
                                        aria-label={isListening ? "Stop listening" : "Use microphone"}
                                    >
                                        <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                                    </Button>
                                    <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} aria-label="Send message">
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    </Button>
                                </form>
                                 <p className="text-xs text-muted-foreground mt-2 text-center">
                                    Example: "Go to gallery" or "Show my profile"
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AiFacelyChatbot; 