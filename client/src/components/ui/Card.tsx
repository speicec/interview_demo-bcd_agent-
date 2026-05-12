import { cn } from "../../lib/utils";
import type { ReactNode, CSSProperties } from "react";

export function Card({
  children,
  title,
  className = "",
  style,
}: {
  children: ReactNode;
  title?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div style={style} className={cn("bg-card border border-border rounded-sm", className)}>
      {title && (
        <div className="px-6 pt-5 pb-3">
          <h3 className="serif-title text-base font-bold text-foreground tracking-wide">
            {title}
          </h3>
          <hr className="card-title-divider mt-2" />
        </div>
      )}
      <div className={title ? "px-6 pb-5" : "p-6"}>{children}</div>
    </div>
  );
}
