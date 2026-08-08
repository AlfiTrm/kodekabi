import type { CSSProperties } from "react";

type FootprintProps = {
  className?: string;
  style?: CSSProperties;
};

export function Footprint({ className = "", style }: FootprintProps) {
  return (
    <svg
      viewBox="0 0 48 88"
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 2C11.9 2 5 12.7 5 27.4C5 41.8 11.2 50 17.4 54.8L14.6 62H33.4L30.6 54.8C36.8 50 43 41.8 43 27.4C43 12.7 36.1 2 24 2Z"
        fill="currentColor"
      />
      <path
        d="M14 66.5C11.8 66.5 10 68.3 10 70.5V80C10 83.3 12.7 86 16 86H32C35.3 86 38 83.3 38 80V70.5C38 68.3 36.2 66.5 34 66.5H14Z"
        fill="currentColor"
      />
      <path d="M10 21H38M8 31H40M11 41H37M16 71H32M14 78H34" stroke="var(--background)" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
      <path d="M24 7V50M24 69V83" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
