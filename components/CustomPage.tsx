'use client'

import React, { useMemo, useEffect } from "react"
import { useParams } from "next/navigation"
import { useApp } from "../store/AppContext"

const CustomPage: React.FC = () => {

  const params = useParams()
  const slug = params?.slug as string

  const { customMenus } = useApp()

  const activeMenu = useMemo(() => {

    if (!slug || !customMenus?.length) return null

    const targetSlug = slug.toLowerCase().trim()

    return customMenus.find(
      m => m.slug?.toLowerCase() === targetSlug && m.isActive
    )

  }, [slug, customMenus])

  useEffect(() => {
    if (activeMenu?.title) {
      document.title = `${activeMenu.title} | Asun Việt Nam`
    }
  }, [activeMenu])

  /* LOADING */

  if (!customMenus?.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">

        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ee4d2d] rounded-full animate-spin"></div>

        <p className="text-xs text-gray-400 uppercase tracking-widest">
          Đang tải nội dung...
        </p>

      </div>
    )
  }

  /* ---------------- NOT FOUND ---------------- */

  if (!activeMenu) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4 px-6">

        <div className="text-6xl opacity-20">🔗</div>

        <h2 className="text-xl font-bold text-gray-500">
          Trang không tồn tại
        </h2>

        <p className="text-sm text-gray-400">
          Trang này có thể đã bị xoá hoặc tạm ẩn.
        </p>

      </div>
    )
  }

  /* ---------------- PAGE ---------------- */

  return (

    <div className="w-full max-w-[1400px] mx-auto px-4 py-6">

      {/* Breadcrumb */}

      <div className="text-xs text-gray-400 mb-3">
        Trang chủ / {activeMenu.title}
      </div>

      {/* TITLE */}

      <div className="flex items-center gap-3 mb-6">

        <div className="w-1.5 h-7 bg-[#ee4d2d] rounded"></div>

        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          {activeMenu.title}
        </h1>

      </div>

      {/* CONTENT */}

      <div className="relative w-full bg-white border rounded-lg shadow-sm overflow-hidden">

        <iframe
          src={activeMenu.url}
          title={activeMenu.title}
          className="w-full h-[75vh] md:h-[80vh]"
          loading="lazy"
          allowFullScreen
        />

      </div>

      {/* ACTION */}

      <div className="flex justify-between items-center mt-4 text-sm text-gray-400">

        <span>Nội dung được nhúng từ liên kết ngoài</span>

        <a
          href={activeMenu.url}
          target="_blank"
          className="text-[#ee4d2d] hover:underline font-medium"
        >
          Mở trang gốc ↗
        </a>

      </div>

    </div>

  )
}

export default CustomPage