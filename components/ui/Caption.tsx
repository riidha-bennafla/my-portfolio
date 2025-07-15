import { cn } from "./../../lib/utils";
import { CaptionProps } from "@/types";

const Caption = ({ text, className, role }: CaptionProps) => {
  switch (role) {
    case "title":
      return (
        <h4
          className={cn(
            "text-zinc-50 text-[13px] tracking-[0.08em] leading-[160%] font-fira-code uppercase",
            className
          )}
        >
          {text}
        </h4>
      );
    case "subtitle":
      return (
        <p
          className={cn(
            "text-zinc-500 text-[13px] tracking-[0.08em] leading-[160%] font-fira-code uppercase",
            className
          )}
        >
          {text}
        </p>
      );
    default:
      return (
        <p
          className={cn(
            "text-white text-[11.5px] tracking-[0.08em] leading-[160%] opacity-40 font-fira-code uppercase",
            className
          )}
        >
          {text}
        </p>
      );
  }
};

export default Caption;
