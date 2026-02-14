import bcrypt from 'bcryptjs';
import clientPromise from '../lib/db.js';
import { generateToken, setAuthCookie } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { identifier, password } = req.body;

    // Validate input
    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const client = await clientPromise;
    const db = client.db('anonymous-inbox');
    const users = db.collection('users');

    // Find user by username OR email
    const user = await users.findOne({
      $or: [
        { username: identifier.toLowerCase() },
        { email: identifier.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username
    });

    // Set httpOnly cookie
    setAuthCookie(res, token);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
