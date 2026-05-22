import Image from "next/image";
import { SectionTitle } from "@/src/shared/ui/section-title";
import { projects } from "@/src/shared/lib/data";

export default function ProjectsPage() {
  return (
    <div className="container py-12">
      <SectionTitle className=""
        title="Реализованные проекты"
        subtitle="Вдохновляйтесь примерами наших работ"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group bg-white border border-[#E5E5E5] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-72 bg-[#F5F5F5] overflow-hidden">
              <Image src={project.image} alt={project.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-[#333333]">
                  {project.title}
                </h3>
                <span className="text-sm text-[#E30613] font-semibold">
                  {project.area}
                </span>
              </div>
              <p className="text-[#666666] text-sm leading-relaxed mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.products.map((product) => (
                  <span
                    key={product}
                    className="text-xs bg-[#F5F5F5] text-[#666666] px-3 py-1 rounded-full"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
