export interface ProductColor {
  name: string;
  hex: string;
  code: string;
  modelImage?: string;
  avatarImage?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  price: number;
  compareAtPrice: number | null;
  rating: number;
  reviewCount: number;
  badge?: string;
  headline: string;
  description: string;
  images: string[];
  relatedImages?: string[];
  colors: ProductColor[];
  sizes: string[];
  lengths?: string[];
  stockStatus: 'in_stock' | 'low_stock' | 'pre_order';
  isNew: boolean;
  isFeatured: boolean;
  details: string[];
  fabricCare: string[];
  fitNotes: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  featured: boolean;
  productCount: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  colorPurchased?: string;
  sizePurchased?: string;
}

export interface CommunityStory {
  id: string;
  author: string;
  role: string;
  city: string;
  quote: string;
  image: string;
  scrubStyle: string;
}

export interface CommunityIdea {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  votes: number;
  status: 'Under Review' | 'In Prototyping' | 'Launched' | 'Beta Testing';
  badge?: string;
}

export interface CartItemCustomization {
  text: string;
  placement: 'Left Pocket' | 'Right Pocket' | 'Chest';
  threadColor: 'Optic White' | 'Hospital Silver' | 'Navy' | 'Gold';
  font: 'Classic Block' | 'Clinical Sans' | 'Script';
  price: number;
}

export interface CartItem {
  cartItemId: string; // unique item instance id (productId + color + size + custom)
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
  customization?: CartItemCustomization;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  status: string;
  currency: string;
  items: OrderItem[];
  customer: CustomerDetails;
  shippingAddress: ShippingAddress;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'afterpay' | 'apple_pay';
  promoCode?: string | null;
  discountAmount: number;
  itemsSubtotal: number;
  shippingCost: number;
  gstIncluded: number;
  total: number;
  estimatedDelivery: string;
}

export interface FilterState {
  category: string;
  colors: string[];
  sizes: string[];
  minPrice: number;
  maxPrice: number;
  sort: string;
  search: string;
}
