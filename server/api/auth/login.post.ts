import { defineEventHandler, readBody } from 'h3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const { email, password, role } = await readBody(event);

  const users: any[] = await $fetch('http://localhost:3001/users');
  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error('Неверные данные');
  }

  const accessToken = jwt.sign(
    { role: role, userId: user.id }, 
    'Steblin-Aleksandr-key-124][[', 
    { expiresIn: '1h' }
  );
  return { accessToken };
});