import { cn } from '@/lib/utils';

interface InitialsAvatarProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function InitialsAvatar({ name, color = '#00A8FF', size = 'md', className }: InitialsAvatarProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-white',
        SIZE_MAP[size],
        className
      )}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}
