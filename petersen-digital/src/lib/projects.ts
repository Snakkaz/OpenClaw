import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type { Project } from "./types";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

function parseProject(slug: string, fileContents: string): Project {
  const { data, content } = matter(fileContents);
  return {
    slug: data.slug || slug,
    title: data.title || slug,
    date: data.date || "",
    featured: data.featured ?? false,
    status: data.status || "published",
    description: data.description || "",
    tech: data.tech || [],
    url: data.url || "",
    github: data.github || "",
    image: data.image || "",
    content,
  };
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fileContents = fs.readFileSync(
        path.join(PROJECTS_DIR, filename),
        "utf8"
      );
      return parseProject(slug, fileContents);
    })
    .filter((p) => p.status === "published")
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getFeaturedProjects(limit = 3): Project[] {
  return getAllProjects()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export async function getProjectBySlug(
  slug: string
): Promise<(Project & { contentHtml: string }) | null> {
  const filePath = path.join(PROJECTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const project = parseProject(slug, fileContents);

  const processed = await remark().use(html).process(project.content);
  const contentHtml = processed.toString();

  return { ...project, contentHtml };
}

export function getAllProjectSlugs(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
