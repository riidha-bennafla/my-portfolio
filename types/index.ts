export interface LinkProps {
  link: string;
  title?: string;
  target?: "_blank" | "_self" | "_parent" | "_top" | string;
  className?: string;
  rel?: RelAttribute;
  arrowIcon?: boolean;
}

export interface TextProps {
  text: string;
  className?: string;
}

export type RelAttribute =
  | "noopener noreferrer"
  | "nofollow"
  | "noopener noreferrer nofollow"
  | string; // Fallback for custom values

export interface CaptionProps {
  text?: string;
  className?: string;
  role?: "title" | "subtitle";
}

export interface ContentSegment {
  id: string;
  type: "text" | "link" | "break line";
  content: string;
  link?: string;
  target?: string;
  sup?: boolean;
  supText?: string;
  arrowIcon?: boolean;
  className?: string;
}

export interface AboutProps {
  title: string;
  content: ContentSegment[];
}

export interface ExperienceItemBaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ExperienceTitleProps extends ExperienceItemBaseProps {
  title: string;
  period?: string;
}

export interface ExperienceDescriptionProps extends ExperienceItemBaseProps {
  description: React.ReactNode; // Allow rich content
}

export interface ExperienceItem {
  id: string;
  title: string;
  period?: string;
  description: React.ReactNode;
}

export interface ExperienceProps {
  items: ExperienceItem[];
  className?: string;
}

// Add to your existing types
export interface Project {
  id: string;
  link: string;
  imageSrc: string;
  altText: string;
  tags?: string[];
  captionTitle: string;
  captionDescription: string;
  target?: string;
  rel?: string;
  className?: string;
}

export interface PortfolioProjectProps extends Project {
  priority?: boolean;
}
