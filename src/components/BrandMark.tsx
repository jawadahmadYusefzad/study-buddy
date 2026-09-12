import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "glass flex shrink-0 items-center justify-center rounded-2xl",
      )}
    >
      <GraduationCap
        className="text-primary"
        style={{ width: size * 0.55, height: size * 0.55 }}
      />
    </div>
  );
}
