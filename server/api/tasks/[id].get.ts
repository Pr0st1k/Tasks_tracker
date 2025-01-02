import { defineEventHandler } from 'h3';
import { $fetch } from 'ofetch';

interface Task {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: string;
}

export default defineEventHandler(async (event) => {
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
});