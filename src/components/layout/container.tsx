import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-12xl',
  xl: 'max-w-8xl',
  full: 'max-w-full'
};

export function Container({ children, className, size = 'lg' }: ContainerProps) {
  return (
    <div className={cn(
      sizeClasses[size],
      "mx-auto",
      className
    )}>
      {children}
    </div>
  );
}