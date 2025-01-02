import { defineEventHandler } from 'h3';
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
  // Получаем userId из параметров запроса
  const query = getQuery(event);
  const userId = query.userId;

  // Получаем все задачи из JSON Server
  const tasks: Task[] = await $fetch('http://localhost:3001/tasks');

  // Фильтруем задачи по userId
  const userTasks = tasks.filter((task: Task) => task.userId === Number(userId));

  return userTasks;
});