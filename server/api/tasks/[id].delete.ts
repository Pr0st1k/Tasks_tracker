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

  // Удаляем задачу из JSON Server
  await $fetch(`http://localhost:3001/tasks/${id}`, {
    method: 'DELETE',
  });

  return { message: 'Задача успешно удалена' };
});