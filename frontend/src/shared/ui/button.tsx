import { cn } from "@/src/shared/utils/cn";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E30613]",
        {
          "bg-[#E30613] text-white hover:bg-[#C50510] active:bg-[#A8040E] border-2 border-transparent":
            variant === "primary",
          "border-2 border-[#E30613] text-[#E30613] hover:bg-[#E30613] hover:text-white":
            variant === "outline",
          "text-[#666666] hover:text-[#E30613]": variant === "ghost",
        },
        {
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-3 text-base": size === "md",
          "px-8 py-4 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
