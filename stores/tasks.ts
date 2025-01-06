import { defineStore } from 'pinia';

  interface Task {
    id: number;
    userId: number;
    title: string;
    description: string;
    status: string;
  }

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
  }),
  actions: {
    async fetchTasks(userId: number) {
      try {
        const tasks = await $fetch('/api/tasks/get', {
          params: { userId },
        });
        this.tasks = tasks;
      } catch (error) {
        console.error('Ошибка при получении задач:', error);
      }
    },
    async addTask(task: Omit<Task, 'id'>) {
      try {
        const newTask : Task = await $fetch('/api/tasks/post', {
          method: 'POST',
          body: task,
        });
        this.tasks.push(newTask);
      } catch (error) {
        console.error('Ошибка при добавлении задачи:', error);
      }
    },
    async updateTask(taskId: number, updatedFields: Partial<Task>) {
      try {
        await $fetch(`/api/tasks/${taskId}`, {
          method: 'PATCH',
          body: updatedFields,
        });
        const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedFields };
        }
      } catch (error) {
        console.error('Ошибка при обновлении задачи:', error);
      }
    },
    async deleteTask(taskId: number) {
      try {
        await $fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE',
        });
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
      } catch (error) {
        console.error('Ошибка при удалении задачи:', error);
      }
    },
  },
});