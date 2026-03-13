
import { Product, Category } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Điện thoại Quantum X',
    brand: 'TechNova',
    price: 24990000,
    originalPrice: 29990000,
    category: Category.SMARTPHONES,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=800&auto=format&fit=crop'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    stock: 25,
    soldCount: 1250,
    createdAt: '2024-01-01T00:00:00Z',
    rating: 4.8,
    description: 'Siêu phẩm flagship với chip xử lý thần kinh tiên tiến nhất hiện nay.',
    warrantyMonths: 24,
    isFeatured: true,
    giftName: 'Tai nghe Nova Buds',
    giftImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop',
    specs: [
      { label: 'Màn hình', value: '6.7" OLED 120Hz' },
      { label: 'Vi xử lý', value: 'Nova-Core A1' },
      { label: 'RAM', value: '12GB' },
      { label: 'Bộ nhớ', value: '256GB' }
    ]
  },
  {
    id: 'p2',
    name: 'Laptop ZenBook Air 15',
    brand: 'Asus',
    price: 32500000,
    originalPrice: 35000000,
    category: Category.LAPTOPS,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=EngW7tLk6R8',
    stock: 12,
    soldCount: 450,
    createdAt: '2024-02-15T00:00:00Z',
    rating: 4.7,
    description: 'Laptop siêu mỏng nhẹ dành cho chuyên gia sáng tạo hay di chuyển.',
    warrantyMonths: 12,
    isFeatured: true,
    specs: [
      { label: 'CPU', value: 'Intel Core i9 Gen 13' },
      { label: 'GPU', value: 'RTX 4060 Ti' },
      { label: 'Pin', value: '18 Tiếng' },
      { label: 'Trọng lượng', value: '1.2 kg' }
    ]
  },
  {
    id: 'p3',
    name: 'Máy lọc nước PureFlow RO 10 lõi',
    brand: 'PureFlow',
    price: 6800000,
    originalPrice: 8500000,
    category: Category.WATER_PURIFIER,
    images: ['https://images.unsplash.com/photo-1585704032915-c3400ca1f963?q=80&w=800&auto=format&fit=crop'],
    stock: 45,
    soldCount: 890,
    createdAt: '2023-11-20T00:00:00Z',
    rating: 4.9,
    description: 'Nước sạch tinh khiết đạt chuẩn đóng chai ngay tại vòi.',
    warrantyMonths: 36,
    specs: [{ label: 'Số lõi lọc', value: '10 lõi' }, { label: 'Công nghệ', value: 'RO thẩm thấu ngược' }]
  },
  {
    id: 'p4',
    name: 'Smart TV Crystal 4K 65 inch',
    brand: 'Samsung',
    price: 15900000,
    originalPrice: 19900000,
    category: Category.ELECTRONICS,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop'],
    stock: 10,
    soldCount: 2100,
    createdAt: '2024-03-01T00:00:00Z',
    rating: 4.6,
    description: 'Trải nghiệm hình ảnh sắc nét gấp 4 lần Full HD.',
    warrantyMonths: 24,
    specs: [{ label: 'Độ phân giải', value: '4K Ultra HD' }, { label: 'Kích thước', value: '65 inch' }]
  }
];
