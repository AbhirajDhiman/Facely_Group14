import { useAuth } from '@/context/AuthContext';
import { User, Settings, LogOut, Brain, BarChart3, Users, Image as ImageIcon, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const StatCard = ({ icon: Icon, title, value, color }: { icon: React.ElementType, title: string, value: string | number, color?: string }) => (
    <Card className="bg-background/70 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 ease-in-out transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className={`h-5 w-5 ${color || 'text-primary'}`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-foreground">{value}</div>
        </CardContent>
    </Card>
);

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
                <Brain className="w-24 h-24 text-primary mb-6 animate-pulse" />
                <h1 className="text-3xl font-bold text-foreground mb-4">Access Denied</h1>
                <p className="text-muted-foreground mb-8 text-center">
                    You need to be logged in to view your profile.
                </p>
                <Button onClick={() => navigate('/signin')}>Sign In</Button>
            </div>
        );
    }

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully!');
            navigate('/signin');
        } catch (error) {
            toast.error('Logout failed. Please try again.');
            console.error('Logout error:', error);
        }
    };
    
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 text-foreground p-4 md:p-8 relative overflow-hidden">
            {/* Subtle AI background elements */}
            <div className="absolute inset-0 -z-10 opacity-5">
                {[...Array(20)].map((_, i) => (
                    <Zap key={i} className="absolute text-primary/50 animate-pulse" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 30 + 20}px`,
                        height: `${Math.random() * 30 + 20}px`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${Math.random() * 5 + 5}s`,
                    }} />
                ))}
            </div>
            
            <div className="max-w-5xl mx-auto relative z-10">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground to-primary-foreground pb-2">
                        Your AI Command Center
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Manage your profile, preferences, and explore your AI-enhanced journey.
                    </p>
                </header>

                <Card className="mb-8 bg-background/80 backdrop-blur-md shadow-2xl border-border/60">
                    <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                        <Avatar className="w-24 h-24 md:w-32 md:h-32 ring-4 ring-primary/50 shadow-lg">
                            <AvatarImage src={user.profilePic || ''} alt={user.name} />
                            <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-semibold text-foreground">{user.name}</h2>
                            <p className="text-primary flex items-center justify-center md:justify-start gap-2">
                                <User className="w-5 h-5" /> {user.email}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Status: <span className={`font-medium ${user.isVerified ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {user.isVerified ? 'Verified' : 'Pending Verification'}
                                </span>
                            </p>
                            <div className="mt-4 flex justify-center md:justify-start space-x-3">
                                <Button variant="outline" size="sm" onClick={() => toast.info('Edit profile functionality coming soon!')}>
                                    <Settings className="w-4 h-4 mr-2" /> Edit Profile
                                </Button>
                                <Button variant="destructive" size="sm" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4 mr-2" /> Logout
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <section className="mb-12">
                    <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
                        <BarChart3 className="w-7 h-7 mr-3 text-primary" /> AI Activity & Stats
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard 
                            icon={Users} 
                            title="Created Groups" 
                            value={user.createdGroups?.length || 0} 
                        />
                        <StatCard 
                            icon={Users} 
                            title="Joined Groups" 
                            value={user.joinedGroups?.length || 0} 
                            color="text-accent-foreground" 
                        />
                        <StatCard 
                            icon={ImageIcon} 
                            title="Gallery Photos" 
                            value={"N/A"} // Placeholder - replace with actual data if available 
                            color="text-purple-500"
                        />
                         <StatCard 
                            icon={ShieldCheck} 
                            title="Account Security" 
                            value={user.isVerified ? "Enhanced" : "Standard"} 
                            color="text-green-500"
                        />
                         <StatCard 
                            icon={Brain} 
                            title="AI Insights Level" 
                            value={"Explorer"} // Placeholder
                            color="text-blue-500"
                        />
                         <StatCard 
                            icon={Zap} 
                            title="AI Features Unlocked" 
                            value={3} // Placeholder
                        />
                    </div>
                </section>

                {/* Placeholder for future AI-themed sections */}
                <section>
                     <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
                        <Brain className="w-7 h-7 mr-3 text-primary" /> Personalized AI Preferences
                    </h3>
                    <Card className="bg-background/70 backdrop-blur-sm border-border/50 p-6">
                        <p className="text-muted-foreground">
                            AI preference settings will be available here soon. Customize your AI interaction, data privacy, and more.
                        </p>
                    </Card>
                </section>

            </div>
        </div>
    );
};

export default ProfilePage; 