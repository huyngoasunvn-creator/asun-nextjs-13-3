
'use client';

import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import { Product, Review } from '../types';

interface ReviewModalProps {
  product: Product;
  orderId: string;
  onClose: () => void;
}

const REVIEW_TAGS = [
  'Chất lượng tốt',
  'Giao hàng nhanh',
  'Màu sắc đẹp',
  'Đóng gói cẩn thận',
  'Tư vấn nhiệt tình'
];

const ReviewModal: React.FC<ReviewModalProps> = ({ product, orderId, onClose }) => {
  const { user } = useAuth();
  const { saveReview } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Fix: Cast 'file' to 'File' to resolve 'unknown' type error in readAsDataURL
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string].slice(0, 5));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const review: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'Khách hàng',
      productId: product.id,
      orderId: orderId,
      rating,
      comment,
      tags: selectedTags,
      images,
      createdAt: new Date().toISOString()
    };

    await saveReview(review);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="text-lg font-black uppercase italic tracking-tighter">Đánh giá sản phẩm</h3>
          <button onClick={onClose}><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
          <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-sm">
            <img src={product.images[0]} className="w-12 h-12 object-cover rounded-sm border" />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-800 truncate uppercase">{product.name}</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Giao hàng thành công</p>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <p className="text-[10px] font-black uppercase text-slate-400">Chất lượng sản phẩm</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-3xl transition-transform active:scale-125"
                >
                  <i className={`fa-star ${rating >= star ? 'fa-solid text-yellow-400' : 'fa-regular text-slate-200'}`}></i>
                </button>
              ))}
            </div>
            <p className="text-[11px] font-black text-[#ee4d2d] uppercase italic">
              {rating === 1 && 'Tệ'}
              {rating === 2 && 'Không hài lòng'}
              {rating === 3 && 'Bình thường'}
              {rating === 4 && 'Hài lòng'}
              {rating === 5 && 'Tuyệt vời'}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase text-slate-400">Chọn từ khóa đánh giá nhanh</p>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                    selectedTags.includes(tag) 
                    ? 'bg-[#ee4d2d] text-white border-[#ee4d2d] shadow-md' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-[#ee4d2d]/50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase text-slate-400">Chi tiết đánh giá</p>
            <textarea 
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              className="w-full p-4 bg-slate-50 border rounded-sm text-sm outline-none focus:border-[#ee4d2d] min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black uppercase text-slate-400">Hình ảnh thực tế ({images.length}/5)</p>
              <label className="cursor-pointer text-blue-600 text-[10px] font-black uppercase hover:underline">
                <i className="fa-solid fa-camera mr-1"></i> Thêm ảnh
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative w-16 h-16 border rounded-sm overflow-hidden">
                  <img src={img} className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(i)}
                    className="absolute top-0 right-0 w-5 h-5 bg-black/60 text-white flex items-center justify-center text-[10px]"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-sm"
            >
              Hủy
            </button>
            <button 
              disabled={isSubmitting || rating === 0}
              type="submit" 
              className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-[11px] tracking-widest rounded-sm shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? <i className="fa-solid fa-spinner animate-spin"></i> : 'HOÀN TẤT ĐÁNH GIÁ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
