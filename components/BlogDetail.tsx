'use client';

import React, { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../store/AppContext';
import { BlogPost } from '../types';
import SmartImage from './SmartImage';

const BlogDetail: React.FC<{ initialBlog?: BlogPost | null }> = ({ initialBlog = null }) => {
  const params = useParams();
  const slug = params?.slug as string;
  const { incrementBlogPostViews } = useApp();

  const post = useMemo(() => {
    if (initialBlog) return initialBlog;
    if (!slug) return null;
    return null;
  }, [initialBlog, slug]);

  useEffect(() => {
    if (!post) return;
    const viewKey = `asun_blog_view_${post.id}`;

    try {
      const lastViewedAt = localStorage.getItem(viewKey);
      if (lastViewedAt && Date.now() - Number(lastViewedAt) < 24 * 60 * 60 * 1000) {
        return;
      }

      localStorage.setItem(viewKey, String(Date.now()));
    } catch {}

    incrementBlogPostViews(post.id);
  }, [post, incrementBlogPostViews]);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
        else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0].split('/')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
      }
    } catch (e) {}
    return url;
  };

  if (!post) return (
    <div className="text-center py-40 animate-in fade-in duration-700">
      <i className="fa-solid fa-newspaper text-6xl text-slate-100 mb-6 block"></i>
      <h2 className="text-xl font-black uppercase text-slate-400 italic">Bài viết không tồn tại hoặc đã bị xóa</h2>
      <Link href="/blog" className="mt-6 inline-block px-8 py-3 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-widest rounded-sm shadow-xl">Quay lại Tin tức</Link>
    </div>
  );

  const embedVideoUrl = post.videoUrl ? getEmbedUrl(post.videoUrl) : '';

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/" className="hover:text-[#ee4d2d]">Trang chủ</Link>
        <i className="fa-solid fa-chevron-right text-[8px]"></i>
        <Link href="/blog" className="hover:text-[#ee4d2d]">Tin tức</Link>
        <i className="fa-solid fa-chevron-right text-[8px]"></i>
        <span className="text-slate-900 truncate">{post.title}</span>
      </nav>

      <article className="space-y-8 bg-white p-6 md:p-12 border rounded-sm shadow-sm">
        <header className="space-y-4 text-center">
           <span className="px-4 py-1 bg-[#ee4d2d] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">{post.category}</span>
           <h1 className="blog-title-vn text-3xl md:text-5xl font-semibold text-slate-900 leading-tight">
  {post.title}
</h1>
           <div className="flex items-center justify-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-y border-slate-50 py-4">
              <span className="flex items-center gap-2"><i className="fa-solid fa-user-pen text-[#ee4d2d]"></i> {post.author}</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-calendar-day"></i> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-eye"></i> {post.views + 1} lượt xem</span>
           </div>
        </header>

        {embedVideoUrl ? (
          <div className="aspect-video rounded-sm overflow-hidden shadow-2xl border-4 border-white bg-black">
             <iframe 
                src={embedVideoUrl} 
                className="w-full h-full" 
                title={post.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
             ></iframe>
          </div>
        ) : (
          <div className="aspect-video rounded-sm overflow-hidden shadow-2xl border-4 border-white">
             <SmartImage src={post.image} widthHint={1200} heightHint={675} priority sizes="100vw" className="w-full h-full object-cover" alt={post.title} />
          </div>
        )}

        <div 
          className="rich-text-content prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed font-medium prose-h2:text-[#ee4d2d] prose-strong:text-slate-900 prose-strong:font-black prose-img:rounded-sm prose-img:shadow-xl prose-a:text-[#ee4d2d] prose-a:font-black prose-a:no-underline hover:prose-a:underline transition-all"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
      </article>
    </div>
  );
};

export default BlogDetail;
