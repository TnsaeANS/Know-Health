import type React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={`container mx-auto px-4 py-8 ${className || ''}`}>
      {children}
    </div>
  );
}
