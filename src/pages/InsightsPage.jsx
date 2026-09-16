import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { BLOG_ARTICLES } from '../data/blogData';

export default function InsightsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featuredArticle = BLOG_ARTICLES.find(a => a.featured) || BLOG_ARTICLES[0];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <SEO
        title="Insights & Journal"
        description="Explore our latest articles, market trends, and expert advice on buying, owning, and selling premium vehicles."
        url="https://autopavilion.in/insights"
      />
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
          to={`/insights/${featuredArticle.slug}`}
          className="block mb-16 rounded-3xl overflow-hidden relative group border border-white/10"
        >
          <div className="absolute inset-0 bg-black">
            <img 
              src={featuredArticle.coverImage} 
              alt={featuredArticle.title} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>
          
          <div className="relative z-10 p-8 sm:p-16 flex flex-col justify-end min-h-[500px]">
            <span className="inline-block px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 w-max">
              Featured Insight
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading uppercase tracking-tight mb-4 max-w-3xl">
              {featuredArticle.title}
            </h2>
            <p className="text-zinc-300 font-mulish max-w-2xl mb-8">
              {featuredArticle.excerpt}
            </p>
            <div className="flex items-center space-x-6 text-xs text-zinc-400 font-bold uppercase tracking-widest">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{featuredArticle.publishedAt}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Autopavilion editorial team</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_ARTICLES.map((article) => (
            <Link 
              to={`/insights/${article.slug}`} 
              key={article.id} 
              className="group cursor-pointer block"
            >
              <div className="relative h-64 mb-6 rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src={article.coverImage} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {article.category}
                </span>
                <h3 className="text-xl font-bold font-heading uppercase text-white group-hover:text-zinc-300 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-zinc-400 font-mulish line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest pt-4 border-t border-white/10">
                  <span>{article.publishedAt}</span>
                  <ArrowRight className="w-4 h-4 group-hover:text-white transition-colors" />
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
