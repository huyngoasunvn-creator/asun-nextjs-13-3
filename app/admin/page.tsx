'use client';

import Link from 'next/link';
import AdminPanel from '@/components/AdminPanel';
import { useAuth } from '@/store/AuthContext';

export default function AdminPage() {
  const { loading, user, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4">
        <div className="rounded-sm border bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-sm font-black uppercase tracking-widest text-slate-500">
            Đang kiểm tra quyền truy cập...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4">
        <div className="w-full rounded-sm border bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
            Truy cập bị từ chối
          </p>
          <h1 className="mt-3 text-2xl font-black uppercase italic text-slate-900">
            Khu vực quản trị chỉ dành cho admin
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Tài khoản hiện tại không có quyền mở trang quản trị.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-sm bg-[#ee4d2d] px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-black"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
}
