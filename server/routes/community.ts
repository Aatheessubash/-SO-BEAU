import { Router, Request, Response } from 'express';
import communityData from '../data/community.json' with { type: 'json' };

const router = Router();

// In-memory clone so submissions and upvotes persist during server lifetime
let communityState = JSON.parse(JSON.stringify(communityData));

// GET community content
router.get('/community', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: communityState,
  });
});

// POST new community idea
router.post('/community/ideas', (req: Request, res: Response) => {
  const { title, description, submittedBy, role } = req.body;

  if (!title || !description || !submittedBy) {
    return res.status(400).json({
      success: false,
      message: 'Please provide title, description and your name/role.',
    });
  }

  const newIdea = {
    id: `idea-${Date.now()}`,
    title,
    description,
    submittedBy: role ? `${submittedBy}, ${role}` : submittedBy,
    votes: 1,
    status: 'Under Review',
    badge: 'New Submission',
  };

  communityState.communityIdeas.unshift(newIdea);

  res.status(201).json({
    success: true,
    message: 'Thank you for shaping SO BEAU! Your idea has been submitted.',
    data: newIdea,
  });
});

// POST upvote an idea
router.post('/community/ideas/:id/vote', (req: Request, res: Response) => {
  const { id } = req.params;
  const idea = communityState.communityIdeas.find((i: any) => i.id === id);

  if (!idea) {
    return res.status(404).json({ success: false, message: 'Idea not found' });
  }

  idea.votes += 1;

  res.json({
    success: true,
    message: 'Vote recorded',
    votes: idea.votes,
  });
});

export default router;
