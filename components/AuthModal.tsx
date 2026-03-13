
'use client';

import React, { useState } from 'react';
// Correct named imports for modular Firebase authentication functions
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { auth } from "../services/firebaseClient";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Modular SDK call for login
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Modular SDK call for registration
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Modular SDK call for updating profile name
        await updateProfile(userCredential.user, { displayName: name });
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-api-key') {
        setError('Lỗi cấu hình: Firebase API Key chưa hợp lệ. Vui lòng kiểm tra file services/firebase.ts');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email này đã được đăng ký. Vui lòng đăng nhập.');
      } else if (err.code === 'auth/weak-password') {
        setError('Mật khẩu quá yếu (tối thiểu 6 ký tự).');
      } else {
        setError('Thông tin không chính xác hoặc lỗi hệ thống. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Nút đóng */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-slate-400 hover:text-red-500 transition-colors">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        {/* Tab Selector */}
        <div className="flex border-b">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all ${isLogin ? 'text-[#ee4d2d] border-b-2 border-[#ee4d2d] bg-white' : 'text-slate-400 bg-slate-50'}`}
          >
            Đăng nhập
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all ${!isLogin ? 'text-[#ee4d2d] border-b-2 border-[#ee4d2d] bg-white' : 'text-slate-400 bg-slate-50'}`}
          >
            Đăng ký mới
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
              {isLogin ? 'Mừng bạn trở lại' : 'Tạo tài khoản Droppii'}
            </h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              {isLogin ? 'Đăng nhập để nhận ưu đãi đặc quyền' : 'Trở thành thành viên của ElectroHub ngay'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase rounded-sm flex items-start gap-3 animate-in shake duration-300">
              <i className="fa-solid fa-circle-exclamation mt-0.5"></i> 
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                  <i className="fa-solid fa-user text-[8px]"></i> Họ và tên
                </label>
                <input 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Nguyễn Văn A" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 text-sm outline-none focus:border-[#ee4d2d] focus:bg-white transition-all rounded-sm" 
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                <i className="fa-solid fa-envelope text-[8px]"></i> Email
              </label>
              <input 
                required 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="example@gmail.com" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 text-sm outline-none focus:border-[#ee4d2d] focus:bg-white transition-all rounded-sm" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                <i className="fa-solid fa-lock text-[8px]"></i> Mật khẩu
              </label>
              <input 
                required 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 text-sm outline-none focus:border-[#ee4d2d] focus:bg-white transition-all rounded-sm" 
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-[9px] font-black text-slate-400 uppercase hover:text-[#ee4d2d]">Quên mật khẩu?</button>
              </div>
            )}

            <button 
              disabled={loading} 
              className="w-full py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
            >
              {loading ? (
                <i className="fa-solid fa-spinner animate-spin"></i>
              ) : (
                <i className={`fa-solid ${isLogin ? 'fa-right-to-bracket' : 'fa-user-plus'}`}></i>
              )}
              {isLogin ? 'ĐĂNG NHẬP NGAY' : 'ĐĂNG KÝ TÀI KHOẢN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
