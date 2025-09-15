import React from "react";

interface CategorySectionProps {
  category: string;
  urls: string[];
}

// Renders a category section: sticky left label + hero mosaic + repeated 3-in-a-box rows
const CategorySection: React.FC<CategorySectionProps> = ({ category, urls }) => {
  if (!urls || urls.length === 0) return null;
  const [u0, u1, u2, ...more] = urls;

  return (
    <section className="relative flex items-start gap-6 md:gap-12 mb-16 scroll-mt-16 ">
      {/* Sticky label */}
      <div className="w-40 md:w-56 lg:w-64 flex-shrink-0">
        <div className="sticky top-4">
          <h2 className="text-neutral-900 text-xl md:text-2xl font-semibold leading-tight">{category}</h2>
        </div>
      </div>

      {/* Images */}
      <div className="flex-1 min-w-0">
        {/* Mosaic: hero + two tiles */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <div className="col-span-3 md:col-span-2 md:row-span-2 h-[300px] md:h-[520px]  overflow-hidden ring-1 ring-neutral-200">
            {u0 && <img src={u0} alt={`${category} 1`} className="w-full h-full object-cover" loading="lazy" />}
          </div>
          {u1 && (
            <div className="col-span-3 md:col-span-1 h-[180px] md:h-[250px] overflow-hidden ring-1 ring-neutral-200">
              <img src={u1} alt={`${category} 2`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}
          {u2 && (
            <div className="col-span-3 md:col-span-1 h-[180px] md:h-[250px] overflow-hidden ring-1 ring-neutral-200">
              <img src={u2} alt={`${category} 3`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}
        </div>

        {/* Remaining: repeat 3-in-a-box rows */}
        {more.length > 0 && (
          <div className="mt-6 space-y-4 md:space-y-6">
            {Array.from({ length: Math.ceil(more.length / 3) }, (_, i) => more.slice(i * 3, i * 3 + 3)).map((chunk, gi) => (
              <div key={gi} className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {chunk.map((url, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden ring-1 ring-neutral-200 aspect-square">
                    <img
                      src={url}
                      alt={`${category} ${gi * 3 + idx + 4}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
                {chunk.length < 3 &&
                  Array.from({ length: 3 - chunk.length }).map((_, fillerIdx) => (
                    <div key={`filler-${fillerIdx}`} className="hidden md:block" />
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;