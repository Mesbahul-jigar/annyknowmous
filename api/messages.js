import clientPromise from '../lib/db.js';
import { getUserFromRequest } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const user = getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const client = await clientPromise;
    const db = client.db('anonymous-inbox');
    const messages = db.collection('messages');

    // Get messages for logged-in user
    const userMessages = await messages
      .find({ recipientUsername: user.username })
      .sort({ createdAt: -1 })
      .toArray();

    // Format response
    const formattedMessages = userMessages.map(msg => ({
      _id: msg._id.toString(),
      message: msg.message,
      createdAt: msg.createdAt.toISOString()
    }));

    return res.status(200).json({ 
      messages: formattedMessages,
      username: user.username 
    });

  } catch (error) {
    console.error('Messages error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
