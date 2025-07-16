// components/ui/ContactInfo.tsx
import DottedLink from "@/components/ui/DottedLink";

interface ContactInfoProps {
  message?: string;
  email?: string;
  emailSupText?: string;
  className?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  message = "let's build something together",
  email = "bennafla.riidha@gmail.com",
  emailSupText = "3",
  className = "",
}) => {
  return (
    <div className={`flex-col space-y-1 ${className}`}>
      <p>{message}</p>
      <span>
        <DottedLink
          link={`mailto:${email}`}
          title={email}
          supText={emailSupText}
        />
      </span>
    </div>
  );
};

export default ContactInfo;
