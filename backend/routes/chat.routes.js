import express from 'express';
import { body, validationResult } from 'express-validator';
import { Chat, Message } from '../models/Chat.model.js';
import User from '../models/User.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/chat/available-users
// @desc    Get users available to start a chat with (all roles)
// @access  Private
router.get('/available-users', async (req, res) => {
  try {
    // Never include the current user in the available users list
    const users = await User.find({
      _id: { $ne: req.user._id },
      status: { $ne: 'Archived' }
    })
      .select('_id name email profileImage')
      .sort({ name: 1 });
    res.json(users);
  } catch (error) {
    console.error('Get available users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat
// @desc    Get all chats for current user (excluding chats soft-deleted for this user)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      hiddenFor: { $ne: req.user._id }
    })
      .populate('participants', 'name email userId profileImage')
      .sort({ lastMessageTime: -1 });
    
    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/:chatId/messages
// @desc    Get messages for a chat (excluding messages soft-deleted for this user)
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

    const messages = await Message.find({
      chatId: req.params.chatId,
      deletedFor: { $ne: req.user._id },
    })
      .populate('sender', 'name email userId profileImage')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chat
// @desc    Create new chat or get existing; if it was hidden for this user, unhide and reuse history
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

    // Check if chat already exists between these two participants
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId], $size: 2 }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user._id, participantId]
      });
    } else if (Array.isArray(chat.hiddenFor) && chat.hiddenFor.some((id) => String(id) === String(req.user._id))) {
      // If this user previously "deleted" (soft-deleted) the chat, unhide it now
      chat.hiddenFor = chat.hiddenFor.filter((id) => String(id) !== String(req.user._id));
      await chat.save();
    }

    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name email userId profileImage');
    
    res.status(201).json(populatedChat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/chat/:chatId
// @desc    Soft-delete chat for current user (hide it) but keep history for other participants
// @access  Private
router.delete('/:chatId', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    if (!chat.participants.some((p) => String(p) === String(req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!Array.isArray(chat.hiddenFor)) {
      chat.hiddenFor = [];
    }
    const alreadyHidden = chat.hiddenFor.some((id) => String(id) === String(req.user._id));
    if (!alreadyHidden) {
      chat.hiddenFor.push(req.user._id);
      await chat.save();
    }

    // Soft-delete all existing messages in this chat for this user, so history
    // stays deleted for them even if the chat becomes visible again.
    await Message.updateMany(
      { chatId: req.params.chatId },
      { $addToSet: { deletedFor: req.user._id } }
    );

    res.json({ message: 'Chat hidden' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/chat/:chatId/messages
// @desc    Soft-delete one or more messages for current user (hide them only for this user)
// @access  Private
router.delete('/:chatId/messages', [
  body('messageIds').isArray().withMessage('messageIds must be an array'),
  body('messageIds.*').isMongoId().withMessage('Invalid message ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    if (!chat.participants.some(p => String(p) === String(req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { messageIds } = req.body;
    const result = await Message.updateMany(
      {
        _id: { $in: messageIds },
        chatId: req.params.chatId
      },
      {
        $addToSet: { deletedFor: req.user._id }
      }
    );
    // We don't change chat.lastMessage globally; the other participant may still see those messages.
    res.json({ deleted: result.modifiedCount });
  } catch (error) {
    console.error('Delete messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chat/:chatId/messages
// @desc    Send message in chat (text and/or image)
// @access  Private
router.post('/:chatId/messages', [
  body('text').optional().trim(),
  body('image').optional()
], async (req, res) => {
  try {
    const text = (req.body.text || '').trim();
    const image = req.body.image || null;
    if (!text && !image) {
      return res.status(400).json({ message: 'Message must contain text or an image' });
    }

    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is participant
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
    }

    // If this chat was soft-deleted (hidden) for any participant, unhide it for everyone
    if (Array.isArray(chat.hiddenFor) && chat.hiddenFor.length > 0) {
      chat.hiddenFor = [];
    }

    const message = await Message.create({
      chatId: req.params.chatId,
      sender: req.user._id,
      senderName: req.user.name,
      text: text || (image ? '[Image]' : ''),
      image: image || undefined
    });

    // Update chat last message
    chat.lastMessage = text || (image ? '[Image]' : '');
    chat.lastMessageTime = new Date();
    chat.unreadCount += 1;
    await chat.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email userId profileImage');

    // Realtime: emit to all participants in this chat (normalize chatId as string for client)
    const io = req.app.get('io');
    if (io) {
      const chatIdStr = String(req.params.chatId);
      const payload = populatedMessage.toObject ? populatedMessage.toObject() : populatedMessage;
      payload.chatId = chatIdStr;
      if (payload.sender && payload.sender._id) payload.sender._id = String(payload.sender._id);
      io.to(`chat:${chatIdStr}`).emit('new_message', payload);
    }
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
