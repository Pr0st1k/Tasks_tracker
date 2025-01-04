import { defineEventHandler } from 'h3';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const authHeader = event.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false };
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(accessToken, 'Steblin-Aleksandr-key-124][[') as { userId: number; role: string };
    return { valid: true, userId: decoded.userId, role: decoded.role };
  } catch (error) {
    return { valid: false };
  }
});