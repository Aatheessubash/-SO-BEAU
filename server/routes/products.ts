import { Router, Request, Response } from 'express';
import productsData from '../data/products.json' with { type: 'json' };
import categoriesData from '../data/categories.json' with { type: 'json' };
import reviewsData from '../data/reviews.json' with { type: 'json' };

const router = Router();

// GET all products with filtering, search & sort
router.get('/products', (req: Request, res: Response) => {
  try {
    let result = [...productsData];
    const { category, search, sort, color, size, minPrice, maxPrice, featured } = req.query;

    // Filter by category
    if (category && category !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === (category as string).toLowerCase()
      );
    }

    // Filter by search query
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.colors.some((c) => c.name.toLowerCase().includes(q))
      );
    }

    // Filter by color
    if (color && typeof color === 'string') {
      const colors = color.split(',').map((c) => c.trim().toLowerCase());
      result = result.filter((p) =>
        p.colors.some((c) => colors.includes(c.code.toLowerCase()) || colors.includes(c.name.toLowerCase()))
      );
    }

    // Filter by size
    if (size && typeof size === 'string') {
      const sizes = size.split(',').map((s) => s.trim().toUpperCase());
      result = result.filter((p) =>
        p.sizes.some((s) => sizes.includes(s.toUpperCase()))
      );
    }

    // Filter by price
    if (minPrice) {
      result = result.filter((p) => p.price >= parseFloat(minPrice as string));
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(maxPrice as string));
    }

    // Filter by featured
    if (featured === 'true') {
      result = result.filter((p) => p.isFeatured);
    }

    // Sort
    if (sort) {
      switch (sort) {
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

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving products', error });
  }
});

// GET single product by slug
router.get('/products/:slug', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = productsData.find((p) => p.slug === slug || p.id === slug);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get matching reviews
    const reviews = reviewsData.filter((r) => r.productId === product.id);

    // Get related products (same category or featured)
    const related = productsData
      .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
      .slice(0, 4);

    res.json({
      success: true,
      data: {
        ...product,
        reviews,
        related,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving product', error });
  }
});

// GET all categories
router.get('/categories', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: categoriesData,
  });
});

export default router;
