import { TextProps } from "@/types";
import { cn } from "@/utils/helpers";

interface SupProps {
  text?: string;
  className?: string;
  arrowIcon?: boolean;
}

export const TextMono = ({ text, className }: TextProps) => {
  return (
    <span className={cn("mono-font text-text opacity-40 uppercase", className)}>
      {text}
    </span>
  );
};

export const TitleMono = ({ text, className }: TextProps) => {
  return (
    <span className={cn("mono-font text-text uppercase", className)}>
      {text}
    </span>
  );
};

export const SubtitleMono = ({ text, className }: TextProps) => {
  return (
    <span className={cn("mono-font text-text-muted uppercase", className)}>
      {text}
    </span>
  );
};

export const Sup = ({ text, className, arrowIcon = false }: SupProps) => {
  return (
    <sup
      className={`font-fira-code text-yellow-300 leading-[0] font-light", ${
        arrowIcon ? "text-xs md:text-sm lg:text-base" : "text-xs"
      }, ${className}`}
    >
      {text}
    </sup>
  );
};
