import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PREVIEW_ARTICLES = [
  {
    id: 1,
    title: "The Evolution of Premium Sedans in 2026",
    category: "Industry Trends",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Why Certified Pre-Owned is the Smart Choice",
    category: "Buying Guide",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Preserving Value: Maintenance Tips",
    category: "Ownership",
    image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=600&auto=format&fit=crop"
  }
];

export default function InsightsPreview() {
  return (
    <section className="py-24 bg-[#08090c] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black font-heading uppercase tracking-tight text-white mb-2">
              The Premium <span className="text-zinc-500 font-extralight">Journal</span>
            </h2>
            <p className="text-sm text-zinc-400 font-mulish max-w-md">
              Market trends, buying guides, and expert advice for luxury vehicle ownership.
            </p>
          </div>
          <Link
            to="/insights"
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            <span>View All Insights</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PREVIEW_ARTICLES.map(article => (
            <Link to="/insights" key={article.id} className="group block">
              <div className="relative h-64 mb-6 rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {article.category}
                </span>
                <h3 className="text-lg font-bold font-heading uppercase text-white group-hover:text-zinc-300 transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
