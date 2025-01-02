import { defineEventHandler } from 'h3';
import { $fetch } from 'ofetch';

export default defineEventHandler(async (event) => {
  // Получаем задачи из JSON Server
  const tasks = await $fetch('http://localhost:3001/tasks');
  return tasks;
});