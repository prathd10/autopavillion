import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_ARTICLES } from '../data/blogData';

// Newest articles first (BLOG_ARTICLES is stored oldest → newest).
const PREVIEW_COUNT = 8;
const PREVIEW_ARTICLES = [...BLOG_ARTICLES].reverse().slice(0, PREVIEW_COUNT);

export default function InsightsPreview() {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [updateArrows]);

  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-[#08090c] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black font-heading uppercase tracking-tight text-white mb-2">
              The Pavilion <span className="text-zinc-500 font-extralight">Journal</span>
            </h2>
            <p className="text-sm text-zinc-400 font-mulish max-w-md">
              Market trends, buying guides, and expert advice for luxury vehicle ownership.
            </p>
          </div>

          {/* Carousel arrows (desktop/tablet) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous articles"
              className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white transition-colors hover:bg-white hover:text-black disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next articles"
              className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white transition-colors hover:bg-white hover:text-black disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Swipeable track */}
        <div
          ref={trackRef}
          onScroll={updateArrows}
          className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PREVIEW_ARTICLES.map(article => (
            <Link
              to={`/insights/${article.slug}`}
              key={article.id}
              data-card
              className="group block shrink-0 snap-start w-[82%] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
            >
              <div className="relative h-64 mb-6 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  loading="lazy"
                  draggable="false"
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

        {/* Explore more */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/insights"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
          >
            <span>Explore More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
