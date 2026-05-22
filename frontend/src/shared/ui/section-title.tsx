import { cn } from "@/src/shared/utils/cn";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  light?: boolean;
}

export function SectionTitle({
  title,
  subtitle,
  className,
  light = false,
}: SectionTitleProps) {
  return (
    <div className={cn("text-center pb-4 flex flex-col items-center gap-3", className)}>
      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-heading",
          light ? "text-white" : "text-[#333333]"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-lg max-w-2xl mx-auto",
            light ? "text-gray-300" : "text-[#666666]"
          )}
          style={{ textAlign: "center" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
