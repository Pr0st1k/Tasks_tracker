import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const { title, description, status, userId } = await readBody(event);

  // Получаем текущий список задач
  const tasks = await fetch('http://localhost:3001/tasks').then((res) => res.json());

  // Генерируем новый ID
  const newId = tasks.length > 0 ? Math.max(...tasks.map((task: any) => task.id)) + 1 : 1;

  const newTask = {
    id: newId,
    userId,
    title,
    description,
    status,
  };

  // Добавляем новую задачу
  await fetch('http://localhost:3001/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTask),
  });

  return { message: 'Задача успешно создана' };
});