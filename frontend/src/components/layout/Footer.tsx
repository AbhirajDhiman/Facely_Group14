
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-accent/5 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold mb-4">
              <span className="text-accent">Facely</span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Revolutionizing group photo sharing with facial recognition technology.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-accent transition-colors">Dashboard</Link></li>
              <li><Link to="/upload" className="text-muted-foreground hover:text-accent transition-colors">Upload</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-muted-foreground hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-accent transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail size={18} />
                <span>hello@facely.app</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={18} />
                <span>123 Tech Street, San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Facely. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
