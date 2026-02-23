import { getAllProjects } from "@/lib/projects";
import ProjectCard from "@/components/portfolio/ProjectCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Prosjekter" };
export const revalidate = 60;

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-2">Prosjekter</h1>
      <p className="text-zinc-400 mb-10">
        Et utvalg av hva jeg har bygget.
      </p>
      {projects.length === 0 ? (
        <p className="text-zinc-500">Ingen prosjekter publisert enda.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
