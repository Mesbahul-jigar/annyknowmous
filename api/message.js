import clientPromise from '../lib/db.js';

// Simple in-memory rate limiting
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const lastMessageTime = rateLimitMap.get(ip);
  
  if (lastMessageTime && now - lastMessageTime < 5000) {
    return false; // Rate limited
  }
  
  rateLimitMap.set(ip, now);
  
  // Clean up old entries (older than 10 seconds)
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value > 10000) {
      rateLimitMap.delete(key);
    }
  }
  
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get IP address for rate limiting
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ 
        success: false, 
        error: 'Please wait before sending another message' 
      });
    }

    const { recipientUsername, message } = req.body;

    // Validate input
    if (!recipientUsername || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Validate message length
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty' });
    }

    if (trimmedMessage.length > 500) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message must be 500 characters or less' 
      });
    }

    const client = await clientPromise;
    const db = client.db('anonymous-inbox');
    const users = db.collection('users');
    const messages = db.collection('messages');

    // Verify recipient exists
    const recipient = await users.findOne({ username: recipientUsername.toLowerCase() });
    if (!recipient) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }

    // Insert message
    await messages.insertOne({
      recipientUsername: recipientUsername.toLowerCase(),
      message: trimmedMessage,
      createdAt: new Date()
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Message error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
