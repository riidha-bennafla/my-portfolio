export * from "./linkTypes";
export * from "./textTypes";

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies?: string[];
  link?: string;
  githubLink?: string;
  status?: "live" | "development" | "locked";
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  link?: string;
  logo?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  location?: string;
  education?: {
    degree: string;
    school: string;
    link?: string;
  }[];
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}
