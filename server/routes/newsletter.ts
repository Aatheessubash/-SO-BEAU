import { Router, Request, Response } from 'express';

const router = Router();
const subscribers: { email: string; date: string }[] = [];
const contactMessages: any[] = [];

// POST newsletter subscription
router.post('/newsletter', (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  if (subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    return res.status(200).json({
      success: true,
      message: 'You are already subscribed! Use code BEAU10 at checkout for 10% off.',
      code: 'BEAU10',
    });
  }

  subscribers.push({ email, date: new Date().toISOString() });

  res.status(201).json({
    success: true,
    message: 'Welcome to the SO BEAU circle. Your 10% welcome code is BEAU10.',
    code: 'BEAU10',
  });
});

// POST contact inquiry
router.post('/contact', (req: Request, res: Response) => {
  const { name, email, department, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please complete all required fields.' });
  }

  const inquiry = {
    id: `msg-${Date.now()}`,
    name,
    email,
    department: department || 'General Support',
    subject: subject || 'Customer Inquiry',
    message,
    receivedAt: new Date().toISOString(),
  };

  contactMessages.push(inquiry);

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out to SO BEAU. Our Melbourne studio team will respond within 24 hours.',
    inquiryId: inquiry.id,
  });
});

export default router;
