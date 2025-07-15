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
