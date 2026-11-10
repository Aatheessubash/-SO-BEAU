import { Product, Category, Review, CommunityStory, CommunityIdea, OrderRecord } from '../types';
import productsData from '../../server/data/products.json';
import categoriesData from '../../server/data/categories.json';
import communityData from '../../server/data/community.json';
import reviewsData from '../../server/data/reviews.json';

const API_BASE = '/api';

// In-memory fallback stores
let localProducts: Product[] = JSON.parse(JSON.stringify(productsData));
let localCategories: Category[] = JSON.parse(JSON.stringify(categoriesData));
let localReviews: Review[] = JSON.parse(JSON.stringify(reviewsData));
let localCommunity = JSON.parse(JSON.stringify(communityData));
let localOrders: OrderRecord[] = [];

// Helper for fetch with fallback
async function fetchWithFallback<T>(
  apiFn: () => Promise<Response>,
  fallbackFn: () => T
): Promise<T> {
  try {
    const res = await apiFn();
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (e) {
    // Graceful fallback to local mock store
    return fallbackFn();
  }
}

export const api = {
  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    sort?: string;
    color?: string;
    size?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
  }): Promise<{ success: boolean; count: number; data: Product[] }> {
    return fetchWithFallback(
      () => {
        const query = new URLSearchParams();
        if (params) {
          if (params.category && params.category !== 'all') query.set('category', params.category);
          if (params.search) query.set('search', params.search);
          if (params.sort) query.set('sort', params.sort);
          if (params.color) query.set('color', params.color);
          if (params.size) query.set('size', params.size);
          if (params.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
          if (params.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());
          if (params.featured) query.set('featured', 'true');
        }
        const qs = query.toString();
        return fetch(`${API_BASE}/products${qs ? `?${qs}` : ''}`);
      },
      () => {
        let result = [...localProducts];
        if (params) {
          if (params.category && params.category !== 'all') {
            result = result.filter(
              (p) => p.category.toLowerCase() === params.category!.toLowerCase()
            );
          }
          if (params.search) {
            const q = params.search.toLowerCase();
            result = result.filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.categoryName.toLowerCase().includes(q) ||
                p.colors.some((c) => c.name.toLowerCase().includes(q))
            );
          }
          if (params.color) {
            const cols = params.color.split(',').map((c) => c.trim().toLowerCase());
            result = result.filter((p) =>
              p.colors.some((c) => cols.includes(c.code.toLowerCase()) || cols.includes(c.name.toLowerCase()))
            );
          }
          if (params.size) {
            const szs = params.size.split(',').map((s) => s.trim().toUpperCase());
            result = result.filter((p) => p.sizes.some((s) => szs.includes(s.toUpperCase())));
          }
          if (params.minPrice !== undefined) {
            result = result.filter((p) => p.price >= params.minPrice!);
          }
          if (params.maxPrice !== undefined) {
            result = result.filter((p) => p.price <= params.maxPrice!);
          }
          if (params.featured) {
            result = result.filter((p) => p.isFeatured);
          }
          if (params.sort) {
            switch (params.sort) {
              case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
              case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
              case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
              case 'newest':
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
              case 'featured':
              default:
                result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
                break;
            }
          }
        }
        return { success: true, count: result.length, data: result };
      }
    );
  },

  async getProductBySlug(slug: string): Promise<{ success: boolean; data: Product }> {
    return fetchWithFallback(
      () => fetch(`${API_BASE}/products/${slug}`),
      () => {
        const prod = localProducts.find((p) => p.slug === slug || p.id === slug);
        if (!prod) throw new Error('Product not found');
        return { success: true, data: prod };
      }
    );
  },

  async getCategories(): Promise<{ success: boolean; data: Category[] }> {
    return fetchWithFallback(
      () => fetch(`${API_BASE}/categories`),
      () => ({ success: true, data: localCategories })
    );
  },

  // Reviews
  async getReviews(productId?: string): Promise<{ success: boolean; count: number; data: Review[] }> {
    return fetchWithFallback(
      () => fetch(productId ? `${API_BASE}/reviews?productId=${productId}` : `${API_BASE}/reviews`),
      () => {
        let res = [...localReviews];
        if (productId) {
          res = res.filter((r) => r.productId === productId);
        }
        return { success: true, count: res.length, data: res };
      }
    );
  },

  async createReview(data: {
    productId: string;
    author: string;
    role?: string;
    location?: string;
    rating: number;
    title: string;
    content: string;
    colorPurchased?: string;
    sizePurchased?: string;
  }): Promise<{ success: boolean; message: string; data: Review }> {
    return fetchWithFallback(
      () =>
        fetch(`${API_BASE}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      () => {
        const newRev: Review = {
          id: `rev-${Date.now()}`,
          productId: data.productId,
          author: data.author,
          role: data.role || 'Healthcare Professional',
          location: data.location || 'Australia',
          rating: Number(data.rating),
          title: data.title || 'Verified Shift Experience',
          content: data.content,
          date: new Date().toISOString().split('T')[0],
          verified: true,
          colorPurchased: data.colorPurchased || 'Deep Charcoal',
          sizePurchased: data.sizePurchased || 'M',
        };
        localReviews.unshift(newRev);
        return { success: true, message: 'Review recorded', data: newRev };
      }
    );
  },

  // Community
  async getCommunity(): Promise<{
    success: boolean;
    data: {
      featuredStories: CommunityStory[];
      communityIdeas: CommunityIdea[];
      stats: { cliniciansConsulted: string; prototypesTested: string; designIterations: string; satisfactionRate: string };
      coDesignStages: { stage: string; title: string; desc: string }[];
    };
  }> {
    return fetchWithFallback(
      () => fetch(`${API_BASE}/community`),
      () => ({ success: true, data: localCommunity })
    );
  },

  async submitCommunityIdea(data: {
    title: string;
    description: string;
    submittedBy: string;
    role?: string;
  }): Promise<{ success: boolean; message: string; data: CommunityIdea }> {
    return fetchWithFallback(
      () =>
        fetch(`${API_BASE}/community/ideas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      () => {
        const newIdea: CommunityIdea = {
          id: `idea-${Date.now()}`,
          title: data.title,
          description: data.description,
          submittedBy: data.role ? `${data.submittedBy}, ${data.role}` : data.submittedBy,
          votes: 1,
          status: 'Under Review',
          badge: 'New Submission',
        };
        localCommunity.communityIdeas.unshift(newIdea);
        return { success: true, message: 'Idea submitted', data: newIdea };
      }
    );
  },

  async voteCommunityIdea(id: string): Promise<{ success: boolean; votes: number }> {
    return fetchWithFallback(
      () => fetch(`${API_BASE}/community/ideas/${id}/vote`, { method: 'POST' }),
      () => {
        const idea = localCommunity.communityIdeas.find((i: any) => i.id === id);
        if (idea) {
          idea.votes += 1;
          return { success: true, votes: idea.votes };
        }
        return { success: true, votes: 1 };
      }
    );
  },

  // Newsletter
  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string; code?: string }> {
    return fetchWithFallback(
      () =>
        fetch(`${API_BASE}/newsletter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }),
      () => ({
        success: true,
        message: 'Welcome to the SO BEAU circle. Your 10% welcome code is BEAU10.',
        code: 'BEAU10',
      })
    );
  },

  // Contact
  async submitContact(data: {
    name: string;
    email: string;
    department?: string;
    subject?: string;
    message: string;
  }): Promise<{ success: boolean; message: string; inquiryId?: string }> {
    return fetchWithFallback(
      () =>
        fetch(`${API_BASE}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      () => ({
        success: true,
        message: 'Message received. We will respond within 24 hours.',
        inquiryId: `msg-${Date.now()}`,
      })
    );
  },

  // Orders
  async createOrder(data: any): Promise<{ success: boolean; message: string; data: OrderRecord }> {
    return fetchWithFallback(
      () =>
        fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      () => {
        const itemsSubtotal = data.items.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        );
        let discountAmount = 0;
        if (data.promoCode && data.promoCode.trim().toUpperCase() === 'BEAU10') {
          discountAmount = Number((itemsSubtotal * 0.1).toFixed(2));
        }
        let shippingCost = data.shippingMethod === 'express' ? 15.0 : itemsSubtotal >= 150 ? 0 : 10.0;
        const finalTotal = itemsSubtotal - discountAmount + shippingCost;
        const gstIncluded = Number((finalTotal / 11).toFixed(2));
        const orderId = `SB-AU-${Math.floor(100000 + Math.random() * 900000)}`;

        const orderRecord: OrderRecord = {
          orderId,
          createdAt: new Date().toISOString(),
          status: 'Confirmed',
          currency: 'AUD',
          items: data.items,
          customer: data.customer,
          shippingAddress: data.shippingAddress,
          shippingMethod: data.shippingMethod,
          paymentMethod: data.paymentMethod,
          promoCode: data.promoCode || null,
          discountAmount,
          itemsSubtotal,
          shippingCost,
          gstIncluded,
          total: finalTotal,
          estimatedDelivery:
            data.shippingMethod === 'express'
              ? '1–2 business days (Australia Post Express)'
              : '3–5 business days (Australia Post Standard)',
        };

        localOrders.push(orderRecord);
        return { success: true, message: 'Order created', data: orderRecord };
      }
    );
  },

  async getOrder(id: string): Promise<{ success: boolean; data: OrderRecord }> {
    return fetchWithFallback(
      () => fetch(`${API_BASE}/orders/${id}`),
      () => {
        const order = localOrders.find((o) => o.orderId === id);
        if (!order) {
          // Provide fallback demo record
          return {
            success: true,
            data: {
              orderId: id,
              createdAt: new Date().toISOString(),
              status: 'Confirmed',
              currency: 'AUD',
              items: [
                {
                  id: 'item-1',
                  productId: 'sb-001',
                  name: "The Women's Nursing Scrub Set",
                  price: 158.0,
                  quantity: 1,
                  color: 'French Navy',
                  size: 'AU 8 (S)',
                  image: '/images/female/female-navy-front.jpg',
                },
                {
                  id: 'item-2',
                  productId: 'sb-002',
                  name: "The Men's Nursing Scrub Set",
                  price: 158.0,
                  quantity: 1,
                  color: 'Deep Charcoal',
                  size: 'AU L (42)',
                  image: '/images/male/male-charcoal-front.jpg',
                },
              ],
              customer: {
                firstName: 'Sarah',
                lastName: 'Mitchell',
                email: 'sarah.mitchell@hospital.org.au',
                phone: '0412 345 678',
              },
              shippingAddress: {
                address1: '42 Lygon Street',
                city: 'Carlton',
                state: 'VIC',
                postcode: '3053',
                country: 'Australia',
              },
              shippingMethod: 'express',
              paymentMethod: 'card',
              discountAmount: 18.6,
              itemsSubtotal: 186.0,
              shippingCost: 0,
              gstIncluded: 15.22,
              total: 167.4,
              estimatedDelivery: '1–2 business days (Australia Post Express)',
            },
          };
        }
        return { success: true, data: order };
      }
    );
  },
};
