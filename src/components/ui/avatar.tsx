import { forwardRef } from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import Image from 'next/image';
import { cn } from '@/utils/styles';

export const Avatar = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
));
Avatar.displayName = 'Avatar';

interface AvatarImageProps {
  src: string | null | undefined;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export const AvatarImage = ({
  src,
  alt = '아바타 이미지',
  className,
  width = 128,
  height = 128,
  priority = false,
}: AvatarImageProps) => {
  const imageSrc = src ?? '/sample.jpg';

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={cn('aspect-square h-full w-full object-cover', className)}
      priority={priority}
    />
  );
};

export const AvatarFallback = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}
    {...props}
  />
));
AvatarFallback.displayName = 'AvatarFallback';
