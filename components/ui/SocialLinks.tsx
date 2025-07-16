// components/ui/SocialLinks.tsx
import DottedLink from "@/components/ui/DottedLink";

interface SocialLink {
  href: string;
  title: string;
  supText: string;
}

interface SocialLinksProps {
  links?: SocialLink[];
  className?: string;
}

const defaultSocialLinks: SocialLink[] = [
  {
    href: "https://github.com/JoHim",
    title: "Github",
    supText: "1",
  },
  {
    href: "https://twitter.com/JoHim",
    title: "Twitter",
    supText: "2",
  },
  {
    href: "https://www.linkedin.com/in/jo-him/",
    title: "Linkedin",
    supText: "3",
  },
  {
    href: "https://www.instagram.com/jo_him/",
    title: "Instagram",
    supText: "4",
  },
  {
    href: "https://www.youtube.com/@JoHim",
    title: "Youtube",
    supText: "5",
  },
];

const SocialLinks: React.FC<SocialLinksProps> = ({
  links = defaultSocialLinks,
  className = "",
}) => {
  return (
    <div className={`flex-col space-y-1 ${className}`}>
      {links.map((link) => (
        <p key={link.title}>
          <DottedLink
            link={link.href}
            title={link.title}
            sup
            supText={link.supText}
          />
        </p>
      ))}
    </div>
  );
};

export default SocialLinks;
