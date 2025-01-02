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
  const { title, description, status, userId } = await readBody(event);

  // Получаем текущий список задач
  const tasks: Task[] = await $fetch('http://localhost:3001/tasks');

  // Генерируем новый ID
  const newId = tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;

  // Создаем новую задачу
  const newTask: Task = {
    id: newId,
    userId: Number(userId), // Убедимся, что userId — число
    title,
    description,
    status,
  };

  // Добавляем новую задачу в JSON Server
  await $fetch('http://localhost:3001/tasks', {
    method: 'POST',
    body: newTask,
  });

  return { message: 'Задача успешно создана' };
});