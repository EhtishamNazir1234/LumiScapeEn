import express from 'express';
import { body, validationResult } from 'express-validator';
import { FAQ, Article, TroubleshootingGuide } from '../models/HelpCenter.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes for viewing
router.get('/faqs', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/troubleshooting', async (req, res) => {
  try {
    const guides = await TroubleshootingGuide.find().sort({ createdAt: -1 });
    res.json(guides);
  } catch (error) {
    console.error('Get troubleshooting guides error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected routes for management
router.use(protect);

// FAQ Management
router.post('/faqs', authorize('super-admin', 'admin'), [
  body('question').trim().notEmpty().withMessage('Question is required'),
  body('answer').trim().notEmpty().withMessage('Answer is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const faq = await FAQ.create(req.body);
    res.status(201).json(faq);
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/faqs/:id', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.json(faq);
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/faqs/:id', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Article Management
router.post('/articles', authorize('super-admin', 'admin'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/articles/:id', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/articles/:id', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Troubleshooting Guide Management
router.post('/troubleshooting', authorize('super-admin', 'admin'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('steps').isArray().withMessage('Steps must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const guide = await TroubleshootingGuide.create(req.body);
    res.status(201).json(guide);
  } catch (error) {
    console.error('Create troubleshooting guide error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/troubleshooting/:id', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const guide = await TroubleshootingGuide.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!guide) {
      return res.status(404).json({ message: 'Troubleshooting guide not found' });
    }

    res.json(guide);
  } catch (error) {
    console.error('Update troubleshooting guide error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/troubleshooting/:id', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const guide = await TroubleshootingGuide.findByIdAndDelete(req.params.id);

    if (!guide) {
      return res.status(404).json({ message: 'Troubleshooting guide not found' });
    }

    res.json({ message: 'Troubleshooting guide deleted successfully' });
  } catch (error) {
    console.error('Delete troubleshooting guide error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
