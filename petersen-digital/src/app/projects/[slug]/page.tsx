import { getProjectBySlug, getAllProjectSlugs } from "@/lib/projects";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Back */}
      <Link
        href="/projects"
        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8 inline-block"
      >
        ← Tilbake til prosjekter
      </Link>

      {/* Header */}
      <h1 className="text-3xl font-bold text-white mb-3">{project.title}</h1>
      <p className="text-zinc-400 mb-6">{project.description}</p>

      {/* Tech badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tech.map((t) => (
          <span
            key={t}
            className="px-2 py-1 rounded-md bg-zinc-800 text-sm text-zinc-300 font-mono border border-zinc-700"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-4 mb-10">
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm transition-colors"
          >
            Se live ↗
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm transition-colors"
          >
            GitHub ↗
          </a>
        )}
      </div>

      {/* Markdown content */}
      {project.contentHtml && (
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: project.contentHtml }}
        />
      )}
    </div>
  );
}
