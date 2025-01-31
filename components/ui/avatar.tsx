import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        ref={ref}
        {...props}
      >
        {src && <img src={src} className="aspect-square h-full w-full" />}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };

export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...props }, ref) => {
    return (
      <img
        className={cn("aspect-square h-full w-full", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

export { AvatarImage }; 