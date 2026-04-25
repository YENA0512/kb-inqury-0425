import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'high' | 'medium' | 'low';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  const variants = {
    default: 'bg-[#6272A4]/10 text-[#6272A4]',
    high: 'bg-[#E07A5F]/10 text-[#E07A5F] border border-[#E07A5F]/20',
    medium: 'bg-amber-100 text-amber-700 border border-amber-200',
    low: 'bg-[#3D9970]/10 text-[#3D9970] border border-[#3D9970]/20',
  };

  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold tracking-tight', variants[variant], className)}>
      {children}
    </span>
  );
};
