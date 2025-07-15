import Caption from "@/components/ui/Caption";
import DottedLink from "@/components/ui/DottedLink";
import { AboutProps } from "@/types";

const About = ({ title, content }: AboutProps) => {
  return (
    <div className="flex-col col-start-1 col-end-13 md:col-end-5 gap-3">
      <Caption text={title} />
      <p className="col-start-1 md:col-start-1 md:col-span-5 col-end-13 mb-4 md:mb-0 body-font z-1000">
        {content.map((segment) => {
          if (segment.type === "link" && segment.link) {
            return (
              <DottedLink
                key={segment.id}
                link={segment.link}
                target={segment.target}
                title={segment.content}
                sup={segment.sup}
                supText={segment.supText}
                arrowIcon={segment.arrowIcon}
              />
            );
          } else if (segment.type === "break line") {
            return <br key={segment.id} />;
          }
          return <span key={segment.id}>{segment.content}</span>;
        })}
      </p>
    </div>
  );
};

export default About;
