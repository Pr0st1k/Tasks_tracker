import { defineEventHandler, readBody } from 'h3';
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

    const id = Number(event.context.params?.id); // Приводим id к числу

    // Получаем данные из тела запроса
    const updatedFields: Task = await readBody(event);

    // Обновляем задачу в JSON Server
    await $fetch(`http://localhost:3001/tasks/${id}`, {
      method: 'PATCH', // Используем PATCH
      body: updatedFields, // Передаём только обновлённые поля
    });

    return { message: 'Задача успешно обновлена' };
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
  }
});