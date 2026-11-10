import { Router, Request, Response } from 'express';
import reviewsData from '../data/reviews.json' with { type: 'json' };

const router = Router();
let reviewsState = JSON.parse(JSON.stringify(reviewsData));

// GET reviews
router.get('/reviews', (req: Request, res: Response) => {
  const { productId } = req.query;
  let results = [...reviewsState];

  if (productId) {
    results = results.filter((r: any) => r.productId === productId);
  }

  res.json({
    success: true,
    count: results.length,
    data: results,
  });
});

// POST review
router.post('/reviews', (req: Request, res: Response) => {
  const { productId, author, role, location, rating, title, content, colorPurchased, sizePurchased } = req.body;

  if (!productId || !author || !rating || !content) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required review fields.',
    });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    productId,
    author,
    role: role || 'Healthcare Professional',
    location: location || 'Australia',
    rating: Number(rating),
    title: title || 'Verified Experience',
    content,
    date: new Date().toISOString().split('T')[0],
    verified: true,
    colorPurchased: colorPurchased || 'Deep Charcoal',
    sizePurchased: sizePurchased || 'M',
  };

  reviewsState.unshift(newReview);

  res.status(201).json({
    success: true,
    message: 'Thank you for reviewing! Your feedback guides our design.',
    data: newReview,
  });
});

export default router;
