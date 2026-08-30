import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ARTICLES, FEATURED_ARTICLE } from '../data/blogs';

export default function InsightsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-xs text-zinc-400 hover:text-white uppercase font-bold tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-16 border-b border-white/10 pb-8 text-center sm:text-left">
          <h1 className="text-4xl sm:text-6xl font-black font-heading uppercase tracking-tight mb-4">
            Insights & <span className="text-zinc-500 font-extralight block sm:inline">Journal</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-mulish max-w-2xl mx-auto sm:mx-0">
            Explore our latest articles, market trends, and expert advice on buying, owning, and selling premium vehicles.
          </p>
        </div>

        {/* Featured Article */}
        <Link 
          to={`/insights/${FEATURED_ARTICLE.id}`}
          className="mb-16 rounded-3xl overflow-hidden relative group border border-white/10 cursor-pointer shadow-2xl block"
        >
          <div className="absolute inset-0 bg-black">
            <img 
              src={FEATURED_ARTICLE.image} 
              alt="Featured" 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>
          
          <div className="relative z-10 p-8 sm:p-16 flex flex-col justify-end min-h-[500px]">
            <span className="inline-block px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 w-max">
              Featured Insight
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading uppercase tracking-tight mb-4 max-w-3xl group-hover:text-zinc-300 transition-colors">
              {FEATURED_ARTICLE.title}
            </h2>
            <p className="text-zinc-300 font-mulish max-w-2xl mb-8">
              {FEATURED_ARTICLE.excerpt}
            </p>
            <div className="flex items-center space-x-6 text-xs text-zinc-400 font-bold uppercase tracking-widest">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{FEATURED_ARTICLE.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{FEATURED_ARTICLE.author}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <Link 
              to={`/insights/${article.id}`}
              key={article.id} 
              className="group cursor-pointer flex flex-col h-full bg-zinc-950/20 border border-white/5 hover:border-white/10 p-5 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-lg animate-fadeIn"
            >
              <div className="relative h-48 sm:h-56 mb-6 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest block">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-bold font-heading uppercase text-white group-hover:text-zinc-300 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-mulish line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest pt-4 border-t border-white/5">
                  <span>{article.date}</span>
                  <div className="flex items-center space-x-1.5 text-zinc-450 group-hover:text-white transition-colors">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
      </main>
      <Footer />
    </div>
  );
}
