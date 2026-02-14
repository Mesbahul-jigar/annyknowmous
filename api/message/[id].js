import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/db.js';
import { getUserFromRequest } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const user = getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Extract message ID from URL
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Message ID required' });
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid message ID' });
    }

    const client = await clientPromise;
    const db = client.db('anonymous-inbox');
    const messages = db.collection('messages');

    // Find message
    const message = await messages.findOne({ _id: new ObjectId(id) });
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    // Verify message belongs to logged-in user
    if (message.recipientUsername !== user.username) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Delete message
    await messages.deleteOne({ _id: new ObjectId(id) });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Delete message error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
