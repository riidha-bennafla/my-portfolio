// src/components/ui/PortfolioProject.tsx
import { cn } from "@/lib/utils";
import { PortfolioProjectProps } from "@/types";
import Link from "next/link";
import Image from "next/image";
import Caption from "./Caption";

const PortfolioProject = ({
  link,
  target,
  className,
  rel = "",
  imageSrc,
  altText,
  tags,
  captionTitle,
  captionDescription,
  ...props
}: PortfolioProjectProps) => {
  const isExternal =
    link.startsWith("http") ||
    link.startsWith("mailto") ||
    link.startsWith("tel");
  const isBlank = target === "_blank";

  const normalizeRel = (rel: string) => {
    const relSet = new Set(rel.split(" "));
    if (isBlank) {
      relSet.add("noopener");
      relSet.add("noreferrer");
    }
    return Array.from(relSet).filter(Boolean).join(" ");
  };

  const resolvedRel = normalizeRel(rel);
  const resolvedTarget = isExternal ? target : undefined;

  const linkContent = (
    <>
      <div className="relative group-hover:opacity-80 duration-300 transition-opacity ease-out">
        <div className="relative w-full overflow-hidden">
          <article className="object-cover w-full h-full overflow-hidden">
            {/* Dynamic Image */}
            <Image
              src={imageSrc}
              alt={altText}
              width={1200}
              height={800}
              className="overflow-hidden"
              priority={true}
              quality={85}
            />
          </article>
        </div>
      </div>
      <div className="mt-3">
        <Caption text={captionTitle} role="title" />
        <Caption text={captionDescription} role="subtitle" />
        {tags && (
          <div className="absolute right-4 top-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-neutral-100 rounded-md px-2 z-10 py-1 bg-gray-800 shadow-xl font-fira-code uppercase text-[13px] tracking-[0.08em] leading-[160%]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return isExternal ? (
    <a
      href={link}
      target={resolvedTarget}
      rel={resolvedRel}
      {...props}
      className={cn(
        "cursor-pointer relative grid w-full opacity-100 select-none group",
        className
      )}
    >
      {linkContent}
    </a>
  ) : (
    <Link href={link} passHref legacyBehavior>
      <a
        {...props}
        className={cn(
          "cursor-pointer relative grid w-full opacity-100 select-none group",
          className
        )}
      >
        {linkContent}
      </a>
    </Link>
  );
};

export default PortfolioProject;
