import Caption from "@/components/ui/Caption";
import { ExperienceTitle, ExperienceDescription } from "./ExperienceSections";

const Experience = () => {
  return (
    <div className="grid grid-cols-6 col-start-1 col-end-13 gap-3 md:col-start-7 ">
      <Caption text="Experience" className="col-start-1" />
      <Caption text="Description" className="col-start-3" />
      <ExperienceTitle title="Design Lead" period="2022-2023" />
      <ExperienceDescription description="Lead the design team for a real-time collaboration platform, developing a user-friendly interface and ensuring a smooth experience for users." />
      <ExperienceTitle title="Design Lead" period="2021-2022" />
      <ExperienceDescription description="Lead the design team for a real-time collaboration platform, developing a user-friendly interface and ensuring a smooth experience for users." />
      <ExperienceTitle title="Design Lead" period="2020-2021" />
      <ExperienceDescription description="Lead the design team for a real-time collaboration platform, developing a user-friendly interface and ensuring a smooth experience for users." />
    </div>
  );
};

export default Experience;
