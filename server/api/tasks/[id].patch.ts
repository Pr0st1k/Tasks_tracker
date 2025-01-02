import { defineEventHandler, readBody } from 'h3';
import { $fetch } from 'ofetch';

// Определяем интерфейс для задачи
interface Task {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: string;
}

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id); // Приводим id к числу

  // Получаем данные из тела запроса
  const updatedFields: Task = await readBody(event);

  // Обновляем задачу в JSON Server
  await $fetch(`http://localhost:3001/tasks/${id}`, {
    method: 'PATCH', // Используем PATCH
    body: updatedFields, // Передаём только обновлённые поля
  });

  return { message: 'Задача успешно обновлена' };
});