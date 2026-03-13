
export const createSlug = (name: string, id: string): string => {
  if (!name) return id;
  const normalized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return `${normalized}-${id}`;
};

/**
 * Giải pháp chuẩn hóa để lấy ID từ slug SEO.
 * Hỗ trợ các định dạng:
 * 1. p-[timestamp] (Hệ thống mới: p-1767662924231)
 * 2. p[number] (Tương thích ngược: p1, p2)
 * 3. ID gốc (Trường hợp slug chỉ là ID)
 */
export function getIdFromSlug(slug: string | undefined): string {
  if (!slug) return '';

  const parts = slug.split('-');
  const last = parts[parts.length - 1];
  const secondLast = parts[parts.length - 2];

  if (secondLast === 'p' && /^\d+$/.test(last)) {
    return last; // chỉ lấy số
  }

  return last;
}
