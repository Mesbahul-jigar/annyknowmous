import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(res, token) {
  const cookie = serialize('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
  res.setHeader('Set-Cookie', cookie);
}

export function getAuthToken(req) {
  const cookies = parse(req.headers.cookie || '');
  return cookies.auth_token;
}

export function getUserFromRequest(req) {
  const token = getAuthToken(req);
  if (!token) return null;
  return verifyToken(token);
}
