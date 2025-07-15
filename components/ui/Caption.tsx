import { cn } from "./../../lib/utils";
import { CaptionProps } from "@/types";

const Caption = ({ text, className, role }: CaptionProps) => {
  switch (role) {
    case "title":
      return <h4 className={cn("caption-font-title", className)}>{text}</h4>;
    case "subtitle":
      return <p className={cn("caption-font-subtitle", className)}>{text}</p>;
    default:
      return <p className={cn("caption-font-default", className)}>{text}</p>;
  }
};

export default Caption;
