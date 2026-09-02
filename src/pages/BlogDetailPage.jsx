import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, ArrowRight, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ARTICLES, FEATURED_ARTICLE } from '../data/blogs';

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the selected article from our centralized articles list or featured article
  const articleId = parseInt(id, 10);
  let article = ARTICLES.find(a => a.id === articleId);
  
  if (!article && articleId === 0) {
    article = FEATURED_ARTICLE;
  }

  // Auto scroll to top on page mount or article ID change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <h1 className="text-3xl font-black font-heading uppercase tracking-widest text-zinc-500">Article Not Found</h1>
          <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
            The article you are looking for does not exist or has been archived.
          </p>
          <Link
            to="/insights"
            className="px-8 py-3.5 rounded-full border border-white/10 text-white font-extrabold text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            Back to Journal
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Get other recommended articles (exclude current one)
  const recommended = ARTICLES.filter(a => a.id !== article.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#08090c] text-white flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Navigation Link */}
          <div className="mb-8">
            <Link
              to="/insights"
              className="inline-flex items-center space-x-2 text-xs text-zinc-400 hover:text-white uppercase font-extrabold tracking-widest transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Journal</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Main Blog Content (8 cols) */}
            <article className="lg:col-span-8 space-y-8">
              
              {/* Category / Title Badge */}
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                  {article.category}
                </span>
                <h1 className="text-3xl sm:text-5xl font-black font-heading uppercase tracking-tight text-white leading-tight">
                  {article.title}
                </h1>
              </div>

              {/* Author & Date info bar */}
              <div className="flex items-center space-x-6 text-[10px] text-zinc-500 font-bold uppercase tracking-widest py-4 border-y border-white/5">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-zinc-600" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-zinc-600" />
                  <span>{article.author}</span>
                </div>
              </div>

              {/* Banner Image */}
              <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-transparent to-transparent opacity-80" />
              </div>

              {/* Blog body copy block */}
              <div className="text-zinc-300 text-sm sm:text-base leading-relaxed space-y-6 whitespace-pre-line font-mulish">
                {article.content}
              </div>

            </article>

            {/* Right: Sidebar recommendations (4 cols) */}
            <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
              
              {/* Quality certification banner widget */}
              <div className="mono-panel p-6 rounded-3xl border border-white/5 bg-zinc-950/40 space-y-4">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-white" />
                  <span className="text-[10px] tracking-widest font-black uppercase text-white">Auto Pavilion Standards</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-mulish">
                  Every pre-owned vehicle listed in our curated showroom undergoes complete documentation checks and rigid multi-point testing in Mumbai.
                </p>
                <Link
                  to="/inventory"
                  className="inline-flex items-center space-x-2 text-[10px] tracking-widest uppercase font-black text-amber-500 hover:text-white transition-colors"
                >
                  <span>Explore Curated Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Recommended articles list */}
              <div className="space-y-5">
                <h3 className="text-xs tracking-widest font-black uppercase text-zinc-400">
                  Recommended Insights
                </h3>
                <div className="space-y-4">
                  {recommended.map(rec => (
                    <Link
                      to={`/insights/${rec.id}`}
                      key={rec.id}
                      className="group flex space-x-4 p-3 rounded-2xl border border-transparent hover:border-white/5 hover:bg-white/5 transition-all"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-zinc-900">
                        <img
                          src={rec.image}
                          alt={rec.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-center space-y-1">
                        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">
                          {rec.category}
                        </span>
                        <h4 className="text-xs font-bold uppercase text-white group-hover:text-zinc-300 transition-colors line-clamp-2">
                          {rec.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </aside>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
