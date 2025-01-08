import { defineEventHandler, getQuery, createError } from 'h3';
import jwt from 'jsonwebtoken';
import { $fetch } from 'ofetch';

export default defineEventHandler(async (event) => {
  const authHeader = event.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'Steblin-Aleksandr-key-124][[') as { userId: string };

    const userId = Number(decoded.userId);

    const tasks = await $fetch('http://localhost:3001/tasks');

    const userTasks = tasks.filter((task: any) => task.userId === userId);

    return userTasks;
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
  }
});