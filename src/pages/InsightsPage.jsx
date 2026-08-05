import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ARTICLES = [
  {
    id: 1,
    title: "The Evolution of Premium Sedans in 2026",
    excerpt: "Discover how top luxury manufacturers are blending performance with unprecedented comfort in this year's lineup.",
    date: "August 12, 2026",
    author: "Auto Pavilion Editorial",
    category: "Industry Trends",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Why Certified Pre-Owned is the Smart Choice",
    excerpt: "An in-depth look at the rigorous inspection standards that make our certified pre-owned vehicles a reliable investment.",
    date: "July 28, 2026",
    author: "Auto Pavilion Editorial",
    category: "Buying Guide",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Preserving Value: Maintenance Tips for Luxury Cars",
    excerpt: "Expert advice from our service partners on how to maintain your vehicle's pristine condition and maximize its resale value.",
    date: "July 15, 2026",
    author: "Auto Pavilion Editorial",
    category: "Ownership",
    image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=1000&auto=format&fit=crop"
  }
];

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
        <div className="mb-16 rounded-3xl overflow-hidden relative group border border-white/10">
          <div className="absolute inset-0 bg-black">
            <img 
              src="https://images.unsplash.com/photo-1503376713253-7b719463b2f5?q=80&w=2000&auto=format&fit=crop" 
              alt="Featured" 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>
          
          <div className="relative z-10 p-8 sm:p-16 flex flex-col justify-end min-h-[500px]">
            <span className="inline-block px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 w-max">
              Featured Insight
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading uppercase tracking-tight mb-4 max-w-3xl">
              The Future of Premium Mobility in India
            </h2>
            <p className="text-zinc-300 font-mulish max-w-2xl mb-8">
              As infrastructure improves and buyer preferences evolve, we analyze the shifting landscape of the Indian luxury car market and what to expect in the coming decade.
            </p>
            <div className="flex items-center space-x-6 text-xs text-zinc-400 font-bold uppercase tracking-widest">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>August 24, 2026</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Editorial Team</span>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <div key={article.id} className="group cursor-pointer">
              <div className="relative h-64 mb-6 rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src={article.image} 
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
                  <span>{article.date}</span>
                  <ArrowRight className="w-4 h-4 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      </main>
      <Footer />
    </div>
  );
}
