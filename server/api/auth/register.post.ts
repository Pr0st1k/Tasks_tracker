import { defineEventHandler, readBody } from 'h3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const { email, password, role } = await readBody(event);

  const users: any[] = await $fetch('http://localhost:3001/users');

  if (users.some((u) => u.email === email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Пользователь с таким email уже существует',
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = { id: users.length + 1, email, password: hashedPassword, role };

  await $fetch('http://localhost:3001/users', {
    method: 'POST',
    body: newUser,
  });

  const accessToken = jwt.sign(
    { role: newUser.role, userId: newUser.id }, 
    'Steblin-Aleksandr-key-124][[', 
    { expiresIn: '1h' }
  );

  return { 
    message: 'Пользователь успешно зарегистрирован', 
    accessToken 
  };
});