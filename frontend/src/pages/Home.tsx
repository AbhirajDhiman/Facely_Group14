import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { FeatureCard } from '@/components/ui/feature-card';
import { ArrowRight, Camera, CircleUser, UserRound, Image, Lock, Share2, Users } from 'lucide-react';
import image3 from '@/assets/Versha.png';
import image2 from '@/assets/chotaDon.png';
import image1 from '@/assets/Jassi.png';



const Home = () => {
  const images = [image1, image2, image3];
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-accent/5 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent via-transparent to-transparent" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Smart Photo Sharing with <span className="text-accent">Face Recognition</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Share group photos securely with Facely's innovative face recognition technology.
                Only users whose faces appear in photos can see them.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative mx-auto max-w-md animate-scale-in animate-delay-200">
              <div className="aspect-square bg-accent/20 rounded-full absolute -top-6 -right-6 w-32 h-32 blur-3xl" />
              <div className="aspect-square bg-primary/20 rounded-full absolute -bottom-6 -left-6 w-32 h-32 blur-3xl" />
              <div className="relative z-10 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-accent/20 flex items-center justify-center">
                        <UserRound className="text-accent" size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium">Team Retreat Photos</h3>
                        <p className="text-sm text-muted-foreground">12 members</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="aspect-square rounded-lg bg-muted">
                      <img src={image1} alt="" />
                    </div>
                    <div className="aspect-square rounded-lg bg-muted">
                      <img src={image2} alt="" />
                    </div>
                    <div className="aspect-square rounded-lg bg-muted">
                      <img src={image3} alt="" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="aspect-square rounded-lg bg-muted"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-accent/20" >
                          <img src={images[i]} alt="" className="w-full h-full object-cover rounded-full" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-muted flex items-center justify-center text-xs">
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View All</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="How Facely Works" 
            description="Our advanced face recognition technology makes sharing group photos safer and more intuitive."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center text-center animate-fade-in animate-delay-100">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6">
                <Camera size={32} />
              </div>
              <h3 className="text-xl font-medium mb-3">Upload Photos</h3>
              <p className="text-muted-foreground">
                Upload group photos to your shared galleries with a simple drag and drop interface.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-fade-in animate-delay-200">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-medium mb-3">Create Groups</h3>
              <p className="text-muted-foreground">
                Create groups for different events and invite friends to join with a unique code.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-fade-in animate-delay-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6">
                <UserRound size={32} />
              </div>
              <h3 className="text-xl font-medium mb-3">Automatic Recognition</h3>
              <p className="text-muted-foreground">
                Our AI automatically recognizes faces and only shows photos to people who appear in them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-accent/5 py-20">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Advanced Features" 
            description="Discover the powerful features that make Facely the best choice for private photo sharing."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <FeatureCard 
              icon={<CircleUser size={24} />}
              title="Personal Galleries"
              description="Each user gets their own private gallery with all photos they appear in across all groups."
              className="animate-fade-in"
            />
            
            <FeatureCard 
              icon={<Lock size={24} />}
              title="Privacy Focused"
              description="Your photos are only visible to those who are in them. No more unwanted sharing."
              className="animate-fade-in animate-delay-100"
            />
            
            <FeatureCard 
              icon={<Share2 size={24} />}
              title="Easy Sharing"
              description="Share entire albums or individual photos with simple link generation."
              className="animate-fade-in animate-delay-200"
            />
            
            <FeatureCard 
              icon={<Image size={24} />}
              title="Bulk Upload"
              description="Upload entire folders of photos at once to save time and effort."
              className="animate-fade-in"
            />
            
            <FeatureCard 
              icon={<Users size={24} />}
              title="Group Management"
              description="Create and manage multiple groups for different events or social circles."
              className="animate-fade-in animate-delay-100"
            />
            
            <FeatureCard 
              icon={<Camera size={24} />}
              title="Profile Pictures"
              description="Download filtered images as perfect profile pictures with one click."
              className="animate-fade-in animate-delay-200"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-accent text-white rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-30" />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform how you share group photos?</h2>
              <p className="text-lg opacity-90 mb-8">
                Sign up today and experience secure, intelligent photo sharing with Facely.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
