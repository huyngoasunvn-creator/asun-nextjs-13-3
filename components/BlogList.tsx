'use client';

import React from 'react';
import { useApp } from '../store/AppContext';
import Link from 'next/link';
import { createSlug } from '../utils/seo';

const BlogList: React.FC = () => {
  const { blogPosts } = useApp();
  const publishedPosts = blogPosts.filter(p => p.isPublished);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 blog-font">
      <div className="bg-slate-900 rounded-sm p-8 md:p-16 overflow-hidden shadow-2xl border-b-4 border-[#ee4d2d] text-center relative">
        <div className="absolute inset-0 opacity-20">
           <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">KỸ NĂNG & MẸO VẶT</h1>
          <p className="text-white/60 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">Cập nhật xu hướng công nghệ & đời sống</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publishedPosts.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white border rounded-sm">
             <i className="fa-solid fa-newspaper text-6xl text-slate-100 mb-4"></i>
             <p className="text-slate-400 font-bold uppercase tracking-widest">Đang cập nhật bài viết mới...</p>
          </div>
        ) : (
          publishedPosts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}-${post.id}`} className="group bg-white border rounded-sm overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full shadow-sm">
              <div className="aspect-video overflow-hidden relative">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-4 left-4">
                   <span className="px-3 py-1 bg-[#ee4d2d] text-white text-[9px] font-black uppercase tracking-widest shadow-lg">{post.category}</span>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                     <span className="flex items-center gap-1.5"><i className="fa-solid fa-calendar"></i> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                     <span className="flex items-center gap-1.5"><i className="fa-solid fa-eye"></i> {post.views} lượt xem</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ee4d2d] transition-colors leading-snug line-clamp-2">
  {post.title}
</h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                </div>
                <div className="pt-6 mt-auto border-t border-slate-50 flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase text-[#ee4d2d] flex items-center gap-2">XEM CHI TIẾT <i className="fa-solid fa-arrow-right-long animate-pulse"></i></span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;
