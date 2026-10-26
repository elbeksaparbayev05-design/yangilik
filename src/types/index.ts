export type Role = 'customer' | 'maker';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatarColor: string;
  createdAt: string;
  // maker-only profile fields
  specialization?: string;
  experienceYears?: number;
  bio?: string;
  location?: string;
}

export type OrderStatus = 'new' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  new: ['accepted', 'cancelled'],
  accepted: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Yangi',
  accepted: 'Qabul qilingan',
  in_progress: 'Jarayonda',
  completed: 'Bajarilgan',
  cancelled: 'Bekor qilingan',
};

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  makerId: string;
  title: string;
  furnitureType: string;
  description: string;
  material?: string;
  color?: string;
  style?: string;
  budget?: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  price: number;
  material: string;
  style: string;
  image: string;
  makerId: string;
  description: string;
}

export interface PortfolioItem {
  id: string;
  makerId: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface MakerService {
  id: string;
  makerId: string;
  name: string;
  description: string;
  priceFrom: number;
  categories: string[];
}

export interface DesignRequest {
  id: string;
  customerId: string;
  furnitureType: string;
  room: string;
  width?: number;
  height?: number;
  depth?: number;
  material: string;
  color: string;
  style: string;
  budget?: number;
  notes?: string;
  createdAt: string;
  resultConcept?: string;
}
