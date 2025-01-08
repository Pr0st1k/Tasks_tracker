import { defineEventHandler } from 'h3';
import { $fetch } from 'ofetch';
import jwt from 'jsonwebtoken';

interface Task {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: string;
}

export default defineEventHandler(async (event) => {
  const authHeader = event.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'Steblin-Aleksandr-key-124][[') as { userId: number };

    const id = Number(event.context.params?.id);

    // Получаем задачу по ID из JSON Server
    const task: Task = await $fetch(`http://localhost:3001/tasks/${id}`);

    if (!task) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Задача не найдена',
      });
    }

    return task;
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
  }
});