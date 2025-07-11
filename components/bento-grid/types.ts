export interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

export interface BentoCardProps {
  id: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  className?: string;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}
