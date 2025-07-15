// src/types/linkTypes.ts
export interface LinkProps {
  link: string;
  title?: string;
  target?: "_blank" | "_self" | "_parent" | "_top" | string;
  className?: string;
  rel?: RelAttribute;
  arrowIcon?: boolean;
}

export interface PortfolioProjectProps extends LinkProps {
  imageSrc: string;
  altText: string;
  title?: string;
  description?: string;
  tags?: string[];
  captionTitle?: string;
  captionDescription?: string;
}

export interface DottedLinkProps extends LinkProps {
  sup?: boolean;
  supText?: string;
}

export type RelAttribute =
  | "noopener noreferrer"
  | "nofollow"
  | "noopener noreferrer nofollow"
  | string; // Fallback for custom values
