import { defineEventHandler } from 'h3';
import { $fetch } from 'ofetch';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  // Получаем задачу по ID из JSON Server
  const task = await $fetch(`http://localhost:3001/tasks/${id}`);

  if (!task) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Задача не найдена',
    });
  }

  return task;
});