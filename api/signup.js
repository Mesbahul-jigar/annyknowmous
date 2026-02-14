import bcrypt from 'bcryptjs';
import clientPromise from '../lib/db.js';
import { generateToken, setAuthCookie } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Validate username: 3-20 characters, alphanumeric only
    if (!/^[a-zA-Z0-9]{3,20}$/.test(username)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username must be 3-20 alphanumeric characters' 
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    // Validate password: minimum 6 characters
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 6 characters' 
      });
    }

    const client = await clientPromise;
    const db = client.db('anonymous-inbox');
    const users = db.collection('users');

    // Check if username already exists
    const existingUser = await users.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await users.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await users.insertOne({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date()
    });

    // Generate JWT token and set cookie for automatic login
    const token = generateToken({
      userId: result.insertedId.toString(),
      username: username.toLowerCase()
    });
    setAuthCookie(res, token);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
