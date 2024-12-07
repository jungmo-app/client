import { Camera, Car, Home, MoreHorizontal, Plane, ShoppingBag, Utensils } from 'lucide-react';

export const categories = [
  { id: 'all', label: '전체', icon: MoreHorizontal },
  { id: 'accommodation', label: '숙소', icon: Home },
  { id: 'flight', label: '항공', icon: Plane },
  { id: 'transport', label: '교통', icon: Car },
  { id: 'tourism', label: '관광', icon: Camera },
  { id: 'food', label: '식비', icon: Utensils },
  { id: 'shopping', label: '쇼핑', icon: ShoppingBag },
];

export const mockExpenses = [
  { id: 1, category: 'food', amount: 15000, date: '2023-12-07', description: '점심 식사', method: '카드' },
  { id: 2, category: 'transport', amount: 5000, date: '2023-12-07', description: '택시', method: '현금' },
  { id: 3, category: 'shopping', amount: 50000, date: '2023-12-06', description: '옷 구매', method: '카드' },
  { id: 4, category: 'accommodation', amount: 100000, date: '2023-12-05', description: '호텔', method: '현금' },
  { id: 5, category: 'tourism', amount: 30000, date: '2023-12-05', description: '박물관 입장료', method: '현금' },
];
