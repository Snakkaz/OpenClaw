import type { Project } from "@/lib/types";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group flex flex-col rounded-xl bg-zinc-900 border border-zinc-800 hover:border-brand-600 transition-colors overflow-hidden">
      {/* Image placeholder */}
      <div className="h-40 bg-zinc-800 flex items-center justify-center">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl">🚀</span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-brand-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-zinc-400 flex-1">{project.description}</p>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-md bg-zinc-800 text-xs text-zinc-300 font-mono border border-zinc-700"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-1">
          <Link
            href={`/projects/${project.slug}`}
            className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            Les mer →
          </Link>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Live ↗
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
