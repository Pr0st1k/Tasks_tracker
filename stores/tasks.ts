import { defineStore } from 'pinia';
import { useAuthStore } from '~/stores/auth'; // Убедитесь, что импорт корректный
import Swal from 'sweetalert2';

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
        const accessToken = useAuthStore().accessToken;
        console.log('Токен в fetchTasks:', accessToken); // Логирование токена

        if (!accessToken) {
          console.error('Токен отсутствует!');
          return;
        }

        const tasks = await $fetch('/api/tasks/get', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        this.tasks = tasks;
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.error('Ошибка авторизации: Необходимо войти в систему');
          useAuthStore().clearAuthData();
          navigateTo('/Auth');
        } else {
          console.error('Ошибка при получении задач:', error);
        }
      }
    },

    async toggleTaskStatus(taskId: number) {
      try {
        const task = this.tasks.find((t) => t.id === taskId);
        if (!task) return;

        const newStatus = task.status === 'completed' ? 'not-completed' : 'completed';
        await this.updateTask(taskId, { status: newStatus });
        Swal.fire('Успех!', 'Статус задачи изменен.', 'success');
      } catch (error) {
        console.error('Ошибка при изменении статуса задачи:', error);
      }
    },

    async editTask(taskId: number) {
      try {
        const task = this.tasks.find((t) => t.id === taskId);
        if (!task) return;

        const result = await Swal.fire({
          title: 'Редактировать задачу',
          html: `
            <input id="title" class="swal2-input" placeholder="Название" value="${task.title}">
            <input id="description" class="swal2-input" placeholder="Описание" value="${task.description}">
            <select id="status" class="swal2-select">
              <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Выполнено</option>
              <option value="not-completed" ${task.status === 'not-completed' ? 'selected' : ''}>Не выполнено</option>
            </select>
          `,
          focusConfirm: false,
          preConfirm: () => {
            const title = (Swal.getPopup()?.querySelector('#title') as HTMLInputElement)?.value;
            const description = (Swal.getPopup()?.querySelector('#description') as HTMLInputElement)?.value;
            const status = (Swal.getPopup()?.querySelector('#status') as HTMLSelectElement)?.value;

            if (!title || !description || !status) {
              Swal.showValidationMessage('Заполните все поля');
              return false;
            }

            return { title, description, status };
          },
        });

        if (result.isConfirmed) {
          await this.updateTask(taskId, result.value);
          Swal.fire('Успех!', 'Задача обновлена.', 'success');
        }
      } catch (error) {
        console.error('Ошибка при редактировании задачи:', error);
      }
    },

    async deleteTask(taskId: number) {
      try {
        const result = await Swal.fire({
          title: 'Вы уверены?',
          text: 'Вы не сможете восстановить эту задачу!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Да, удалить!',
        });

        if (result.isConfirmed) {
          await $fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${useAuthStore().accessToken}`,
            },
          });
          this.tasks = this.tasks.filter((t) => t.id !== taskId);
          Swal.fire('Успех!', 'Задача удалена.', 'success');
        }
      } catch (error) {
        console.error('Ошибка при удалении задачи:', error);
      }
    },

    async updateTask(taskId: number, updatedFields: Partial<Task>) {
      try {
        await $fetch(`/api/tasks/${taskId}`, {
          method: 'PATCH',
          body: updatedFields,
          headers: {
            Authorization: `Bearer ${useAuthStore().accessToken}`,
          },
        });
        const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedFields };
        }
      } catch (error) {
        console.error('Ошибка при обновлении задачи:', error);
      }
    },
  },
});