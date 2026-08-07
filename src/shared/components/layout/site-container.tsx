import type { ReactNode } from "react";

type SiteContainerProps = {
  children: ReactNode;
  className?: string;
};

export function SiteContainer({
  children,
  className = "",
}: SiteContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1390px] px-5 sm:px-6 lg:px-10 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
