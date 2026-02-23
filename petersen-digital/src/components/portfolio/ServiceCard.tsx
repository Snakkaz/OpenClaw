import type { Service } from "@/lib/types";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-brand-700 transition-colors">
      <span className="text-3xl">{service.icon}</span>
      <h3 className="text-lg font-semibold text-white">{service.title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{service.description}</p>
    </div>
  );
}
