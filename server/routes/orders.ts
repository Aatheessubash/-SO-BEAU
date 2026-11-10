import { Router, Request, Response } from 'express';

const router = Router();

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
}

interface OrderData {
  items: OrderItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'afterpay' | 'apple_pay';
  promoCode?: string;
  notes?: string;
}

// In-memory orders store
const orders: any[] = [];

// POST create order
router.post('/orders', (req: Request, res: Response) => {
  const data: OrderData = req.body;

  if (!data.items || data.items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  if (!data.customer?.email || !data.shippingAddress?.postcode) {
    return res.status(400).json({ success: false, message: 'Missing required customer details' });
  }

  // Calculate pricing in AUD
  const itemsSubtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Discount
  let discountAmount = 0;
  if (data.promoCode && data.promoCode.trim().toUpperCase() === 'BEAU10') {
    discountAmount = Number((itemsSubtotal * 0.1).toFixed(2));
  }

  // Free standard shipping in Australia on orders >= $150 AUD
  let shippingCost = 0;
  if (data.shippingMethod === 'express') {
    shippingCost = 15.00;
  } else {
    shippingCost = itemsSubtotal >= 150 ? 0 : 10.00;
  }

  const finalTotal = itemsSubtotal - discountAmount + shippingCost;
  // Australian GST (10% included in prices)
  const gstIncluded = Number((finalTotal / 11).toFixed(2));

  const orderId = `SB-AU-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderRecord = {
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
    estimatedDelivery: data.shippingMethod === 'express' ? '1-2 business days' : '3-5 business days',
  };

  orders.push(orderRecord);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: orderRecord,
  });
});

// GET order details by ID
router.get('/orders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const order = orders.find((o) => o.orderId === id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, data: order });
});

export default router;
