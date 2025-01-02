import { defineEventHandler, readBody } from 'h3';
import { $fetch } from 'ofetch';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const { title, description, status } = await readBody(event);

  // Обновляем задачу в JSON Server
  await $fetch(`http://localhost:3001/tasks/${id}`, {
    method: 'PUT',
    body: { title, description, status },
  });

  return { message: 'Задача успешно обновлена' };
});