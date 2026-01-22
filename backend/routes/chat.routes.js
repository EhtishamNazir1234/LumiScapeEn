import express from 'express';
import { body, validationResult } from 'express-validator';
import { Chat, Message } from '../models/Chat.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/chat
// @desc    Get all chats for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'name email userId')
      .sort({ lastMessageTime: -1 });
    
    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/:chatId/messages
// @desc    Get messages for a chat
// @access  Private
router.get('/:chatId/messages', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is participant
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    const messages = await Message.find({ chatId: req.params.chatId })
      .populate('sender', 'name email userId')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chat
// @desc    Create new chat or get existing
// @access  Private
router.post('/', [
  body('participantId').notEmpty().withMessage('Participant ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { participantId } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId], $size: 2 }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user._id, participantId]
      });
    }

    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name email userId');
    
    res.status(201).json(populatedChat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chat/:chatId/messages
// @desc    Send message in chat
// @access  Private
router.post('/:chatId/messages', [
  body('text').trim().notEmpty().withMessage('Message text is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is participant
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
    }

    const message = await Message.create({
      chatId: req.params.chatId,
      sender: req.user._id,
      senderName: req.user.name,
      text: req.body.text
    });

    // Update chat last message
    chat.lastMessage = req.body.text;
    chat.lastMessageTime = new Date();
    chat.unreadCount += 1;
    await chat.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email userId');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
