
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  className 
}: FeatureCardProps) {
  return (
    <div 
      className={cn(
        "p-6 rounded-xl hover-lift card-gradient border border-border",
        className
      )}
    >
      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
