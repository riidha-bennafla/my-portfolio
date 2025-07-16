// src/components/ui/DottedLink.tsx
import { cn } from "@/utils/helpers";
import Link from "next/link";
import { LinkProps } from "@/types";
import { Sup } from "./Text";

interface DottedLinkProps extends LinkProps {
  sup?: boolean;
  supText?: string;
}

const DottedLink = ({
  link,
  title,
  target,
  className,
  rel = "",
  sup = false,
  supText,
  arrowIcon,
}: DottedLinkProps) => {
  // Determine if link is external (http/https) or internal
  const isExternal =
    link.startsWith("http") ||
    link.startsWith("mailto") ||
    link.startsWith("tel");
  const isBlank = target === "_blank";

  // Normalize rel (avoid duplicates, auto-add security attributes)
  const normalizeRel = (rel: string) => {
    const relSet = new Set(rel.split(" "));
    if (isBlank) {
      relSet.add("noopener");
      relSet.add("noreferrer");
    }
    return Array.from(relSet).filter(Boolean).join(" ");
  };

  const resolvedRel = normalizeRel(rel);
  const resolvedTarget = isExternal ? target : undefined; // Don't use target for internal links

  // Link content (reusable for both <a> and Next.js <Link>)
  const linkContent = (
    <span
      className={cn(
        "cursor-pointer border-dotted border-b border-yellow-300/30 hover:bg-yellow-300/10 px-[2px] hover:text-yellow-300 hover:border-yellow-300 pt-[2px] dotted-underline duration-150 transition-colors",
        className
      )}
    >
      {title}
    </span>
  );

  return isExternal ? (
    <>
      <a href={link} target={resolvedTarget} rel={resolvedRel}>
        {linkContent}
      </a>
      {sup && <Sup text={supText} arrowIcon={arrowIcon} />}
    </>
  ) : (
    <Link href={link}>
      {linkContent}
      {sup && <Sup text={supText} arrowIcon={arrowIcon} />}
    </Link>
  );
};

export default DottedLink;
