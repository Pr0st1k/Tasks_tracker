import { defineEventHandler } from 'h3';
import { $fetch } from 'ofetch';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  // Удаляем задачу из JSON Server
  await $fetch(`http://localhost:3001/tasks/${id}`, {
    method: 'DELETE',
  });

  return { message: 'Задача успешно удалена' };
});