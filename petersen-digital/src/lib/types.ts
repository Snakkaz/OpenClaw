export interface Project {
  slug: string;
  title: string;
  date: string;
  featured: boolean;
  status: "published" | "draft";
  description: string;
  tech: string[];
  url: string;
  github: string;
  image: string;
  content: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  location: string;
  available: boolean;
  email: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  services: Service[];
}
