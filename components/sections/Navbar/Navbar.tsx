import { personalInfo } from "@/data/personal";
import Link from "next/link";
const Navbar = () => {
  return (
    <nav className="nav-font sticky-top border-b-white/10 grid-layout bg-main py-4 z-[100]">
      <span className="col-span-4 col-start-1">
        <Link
          href="/"
          className="text-white hover:text-yellow-300 duration-300 transition-color inline-flex"
        >
          <h1>{personalInfo.name}</h1>
        </Link>
      </span>

      <p className="col-span-6 md:col-span-3 lg:col-span-2 md:col-start-7 lg:col-start-7 select-none">
        {personalInfo.title}
      </p>
      <p className="hidden col-span-3 lg:inline md:col-start-9 select-none">
        {personalInfo.location}
      </p>
    </nav>
  );
};

export default Navbar;
