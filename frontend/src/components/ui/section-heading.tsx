
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({ 
  title, 
  description, 
  align = 'center', 
  className,
  children
}: SectionHeadingProps) {
  return (
    <div 
      className={cn(
        'mb-10',
        align === 'left' && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
    >
      <h2 className="text-3xl font-bold mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
