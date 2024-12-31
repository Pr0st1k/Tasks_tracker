import { defineEventHandler, readBody } from 'h3';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const { email, password, role } = await readBody(event);

  const users: any[] = await $fetch('http://localhost:3001/users');
  if (users.some((u) => u.email === email)) {
    throw new Error('User already exists');
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { id: users.length + 1, email, password: hashedPassword, role };

  await $fetch('http://localhost:3001/users', {
    method: 'POST',
    body: newUser,
  });

  return { message: 'Пользователь успешно зарегистрирован' };
});