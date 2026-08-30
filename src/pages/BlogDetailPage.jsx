import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Clock, CheckCircle2, 
  ChevronDown, ChevronUp, Sparkles, ShieldCheck, ArrowRight, 
  Copy, Check, MessageSquare 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { BLOG_ARTICLES, getArticleBySlug } from '../data/blogData';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#08090c] text-white flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-4 text-center py-32">
          <h1 className="text-4xl font-heading font-black uppercase mb-4 text-zinc-200">Article Not Found</h1>
          <p className="text-zinc-400 mb-8 max-w-md">The insight or journal article you are looking for may have been moved or updated.</p>
          <Link 
            to="/insights" 
            className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-zinc-200 transition-colors"
          >
            Explore All Insights
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${article.title}\n\nRead more on Auto Pavilion: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  const relatedArticles = BLOG_ARTICLES.filter(a => a.slug !== article.slug).slice(0, 2);

  // Dynamic JSON-LD Structured Data for this specific Article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://autopavilion.in/insights/${article.slug}`
    },
    "headline": article.title,
    "description": article.excerpt,
    "image": [article.coverImage],
    "datePublished": "2026-08-28T09:00:00+05:30",
    "dateModified": "2026-08-29T12:00:00+05:30",
    "author": {
      "@type": "Person",
      "name": article.author.name,
      "jobTitle": article.author.role
    },
    "publisher": {
      "@type": "Organization",
      "name": "Auto Pavilion",
      "logo": {
        "@type": "ImageObject",
        "url": "https://autopavilion.in/wp-content/uploads/2020/12/cropped-icon-v-32x32.png"
      }
    },
    "keywords": article.tags.join(", ")
  };

  // FAQ Schema if article has FAQs
  const faqSchema = article.faqs && article.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  const combinedSchema = faqSchema ? [articleSchema, faqSchema] : articleSchema;

  return (
    <div className="min-h-screen bg-[#08090c] text-white flex flex-col selection:bg-[#e63946] selection:text-white">
      {/* Dynamic Per-Page SEO */}
      <SEO
        title={article.seo.metaTitle}
        description={article.seo.metaDescription}
        keywords={article.seo.keywords}
        image={article.coverImage}
        url={article.seo.canonical}
        type="article"
        schema={combinedSchema}
      />

      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Back Link */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/insights" 
              className="inline-flex items-center space-x-2 text-xs text-zinc-400 hover:text-white uppercase font-bold tracking-widest transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Insights</span>
            </Link>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleShareWhatsApp}
                title="Share on WhatsApp"
                className="p-2 rounded-full bg-white/5 hover:bg-emerald-600/20 text-zinc-400 hover:text-emerald-400 transition-colors border border-white/10"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyLink}
                title="Copy Article Link"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/10 relative"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Article Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3.5 py-1 rounded-full bg-white/10 text-[#e63946] font-extrabold text-[11px] uppercase tracking-widest border border-white/10 backdrop-blur-md">
                {article.category}
              </span>
              <span className="flex items-center text-xs font-semibold text-zinc-400 space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </span>
              <span className="flex items-center text-xs font-semibold text-zinc-400 space-x-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.publishedAt}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight uppercase leading-[1.15] mb-6 text-slate-100">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-lg sm:text-xl text-zinc-300 font-mulish font-normal leading-relaxed mb-6 border-l-2 border-[#e63946] pl-4">
                {article.subtitle}
              </p>
            )}

            {/* Author Byline */}
            <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
              <img 
                src={article.author.avatar} 
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-md"
              />
              <div>
                <div className="font-bold text-sm text-white">{article.author.name}</div>
                <div className="text-xs text-zinc-400">{article.author.role}</div>
              </div>
            </div>
          </header>

          {/* Cover Hero Image */}
          <div className="relative mb-12 rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
            <img 
              src={article.coverImage} 
              alt={article.title}
              className="w-full h-[320px] sm:h-[480px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-transparent to-transparent opacity-80" />
          </div>

          {/* Key Takeaways Box */}
          {article.keyTakeaways && (
            <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border border-white/10 shadow-xl backdrop-blur-sm">
              <div className="flex items-center space-x-2.5 text-[#e63946] mb-4">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">
                  Executive Summary & Key Takeaways
                </h2>
              </div>
              <ul className="space-y-3">
                {article.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm text-zinc-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Structured Article Body */}
          <div className="space-y-10 text-zinc-300 font-mulish text-base sm:text-lg leading-relaxed">
            {article.contentSections.map((section, idx) => {
              if (section.type === 'paragraph') {
                return (
                  <section key={idx} className="space-y-4">
                    {section.heading && (
                      <h2 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-tight text-white pt-4">
                        {section.heading}
                      </h2>
                    )}
                    <div className="whitespace-pre-line text-zinc-300 font-light leading-relaxed">
                      {section.content}
                    </div>
                  </section>
                );
              }

              if (section.type === 'callout') {
                return (
                  <div 
                    key={idx} 
                    className="p-6 rounded-2xl bg-[#e63946]/10 border border-[#e63946]/30 my-8 backdrop-blur-md"
                  >
                    <div className="font-heading font-bold uppercase tracking-wider text-sm text-[#e63946] mb-1.5">
                      {section.title}
                    </div>
                    <p className="text-sm sm:text-base text-zinc-200 font-normal leading-relaxed">
                      {section.text}
                    </p>
                  </div>
                );
              }

              if (section.type === 'checklist') {
                return (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                    {section.items.map((item, cIdx) => (
                      <div 
                        key={cIdx} 
                        className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-center space-x-2 text-white font-bold text-sm mb-2">
                          <ShieldCheck className="w-4 h-4 text-[#e63946]" />
                          <span>{item.title}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              }

              if (section.type === 'table') {
                return (
                  <div key={idx} className="my-8 overflow-x-auto rounded-2xl border border-white/15 bg-zinc-950/60 shadow-2xl">
                    {section.heading && (
                      <div className="p-4 sm:p-5 bg-white/5 border-b border-white/10 font-heading font-bold uppercase tracking-wider text-sm text-white">
                        {section.heading}
                      </div>
                    )}
                    <table className="w-full text-left text-xs sm:text-sm text-zinc-300">
                      <thead className="bg-white/10 text-white uppercase text-[11px] font-bold tracking-widest">
                        <tr>
                          {section.columns.map((col, cIdx) => (
                            <th key={cIdx} className="p-3.5 sm:p-4 font-extrabold border-b border-white/10">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {section.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                            {row.map((cell, cellIdx) => (
                              <td 
                                key={cellIdx} 
                                className={`p-3.5 sm:p-4 ${cellIdx === 0 ? 'font-bold text-white' : 'text-zinc-300'}`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (section.type === 'image') {
                return (
                  <figure key={idx} className="my-10 space-y-3">
                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-zinc-950">
                      <img
                        src={section.url}
                        alt={section.alt || article.title}
                        className="w-full h-[280px] sm:h-[420px] object-cover"
                      />
                    </div>
                    {section.caption && (
                      <figcaption className="text-center text-xs text-zinc-400 font-mulish italic">
                        {section.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }

              return null;
            })}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mr-2">Tagged:</span>
            {article.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 bg-white/5 text-zinc-400 rounded-full text-xs font-semibold border border-white/10"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* FAQ Accordion Section (Rich Snippets) */}
          {article.faqs && article.faqs.length > 0 && (
            <section className="mt-16 pt-12 border-t border-white/10">
              <div className="mb-8">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#e63946] mb-2 block">
                  Frequently Asked Questions
                </span>
                <h2 className="text-2xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight">
                  Expert Answers & Clarifications
                </h2>
              </div>

              <div className="space-y-4">
                {article.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div 
                      key={idx}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between space-x-4 hover:bg-white/[0.02] transition-colors"
                      >
                        <span className="font-heading font-bold text-base sm:text-lg text-white">
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-[#e63946] shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-zinc-400 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-5 sm:p-6 pt-0 text-sm sm:text-base text-zinc-300 leading-relaxed border-t border-white/5 bg-white/[0.01]">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Dealership Lead Capture / Sourcing CTA Banner */}
          <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-zinc-900 via-[#181a20] to-zinc-900 border border-white/15 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-[#e63946] border border-white/10">
                Auto Pavilion Concierge
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-white">
                Looking to Acquire or Sell a Supercar?
              </h3>
              <p className="text-sm text-zinc-300 font-mulish">
                Browse our audited 251-point certified inventory or let our sourcing desk locate your bespoke specification across India.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/inventory"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white text-black font-extrabold uppercase text-xs tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-lg"
                >
                  Explore Showroom Inventory
                </Link>
                <Link
                  to="/sourcing"
                  className="w-full sm:w-auto px-6 py-3.5 bg-transparent text-white border border-white/30 font-extrabold uppercase text-xs tracking-widest rounded-xl hover:bg-white/10 transition-all"
                >
                  Request Vehicle Sourcing
                </Link>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-20 pt-12 border-t border-white/10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase text-white tracking-tight">
                  Continue Reading
                </h2>
                <Link 
                  to="/insights" 
                  className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>All Insights</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedArticles.map((rel) => (
                  <Link 
                    key={rel.id} 
                    to={`/insights/${rel.slug}`} 
                    className="group block p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="relative h-44 mb-4 rounded-xl overflow-hidden">
                      <img 
                        src={rel.coverImage} 
                        alt={rel.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#e63946] uppercase tracking-widest block mb-1.5">
                      {rel.category}
                    </span>
                    <h3 className="font-heading font-bold text-base text-white group-hover:text-zinc-300 transition-colors line-clamp-2 mb-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mulish line-clamp-2">
                      {rel.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </article>
      </main>

      <Footer />
    </div>
  );
}
