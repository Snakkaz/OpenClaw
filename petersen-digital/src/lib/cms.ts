import fs from "fs/promises";
import path from "path";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildFrontmatter(data: Record<string, unknown>): string {
  const slug = (data.slug as string) || toSlug(data.title as string);
  const date = new Date().toISOString().split("T")[0];
  const tech = ((data.tech as string[]) || [])
    .map((t) => `"${t}"`)
    .join(", ");

  return [
    "---",
    `title: "${data.title}"`,
    `slug: "${slug}"`,
    `date: "${date}"`,
    `featured: ${data.featured ?? false}`,
    `status: "${data.status ?? "published"}"`,
    `description: "${data.description ?? ""}"`,
    `tech: [${tech}]`,
    `url: "${data.url ?? ""}"`,
    `github: "${data.github ?? ""}"`,
    `image: "${data.image ?? ""}"`,
    "---",
    "",
    (data.body as string) ?? "",
  ].join("\n");
}

export async function writeProjectFile(
  data: Record<string, unknown>
): Promise<string> {
  const slug = (data.slug as string) || toSlug(data.title as string);
  const filePath = path.join(PROJECTS_DIR, `${slug}.md`);
  await fs.mkdir(PROJECTS_DIR, { recursive: true });
  await fs.writeFile(filePath, buildFrontmatter({ ...data, slug }), "utf-8");
  return slug;
}

export async function deleteProjectFile(slug: string): Promise<void> {
  const filePath = path.join(PROJECTS_DIR, `${slug}.md`);
  await fs.unlink(filePath);
}
