<script setup lang="ts">
  import Swal from 'sweetalert2';

  const tasks = ref([]);

  definePageMeta({
    middleware: 'auth',
  });

  // Получение задач
  const fetchTasks = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const { userId } = await $fetch('/api/token/validate-token', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    tasks.value = await $fetch(`/api/tasks/get`, {
      params: { userId },
    });
  };

  onMounted(fetchTasks);

  const toggleTaskStatus = async (taskId: number) => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'not-completed' : 'completed';

    try {
      await $fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        body: { ...task, status: newStatus },
      });

      task.status = newStatus;
      Swal.fire('Успех!', 'Статус задачи изменен.', 'success');
    } catch (error) {
      Swal.fire('Ошибка!', 'Не удалось изменить статус задачи.', 'error');
    }
  };

  // Редактирование задачи
  const editTask = (taskId: number) => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (!task) return;

    Swal.fire({
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await $fetch(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            body: { ...task, ...result.value },
          });

          Object.assign(task, result.value);
          Swal.fire('Успех!', 'Задача обновлена.', 'success');
        } catch (error) {
          Swal.fire('Ошибка!', 'Не удалось обновить задачу.', 'error');
        }
      }
    });
  };

  // Удаление задачи
  const deleteTask = (taskId: number) => {
    Swal.fire({
      title: 'Вы уверены?',
      text: 'Вы не сможете восстановить эту задачу!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Да, удалить!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await $fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
          });

          // Удаляем задачу из списка
          tasks.value = tasks.value.filter((t) => t.id !== taskId);
          Swal.fire('Успех!', 'Задача удалена.', 'success');
        } catch (error) {
          Swal.fire('Ошибка!', 'Не удалось удалить задачу.', 'error');
        }
      }
    });
  };
</script>

<template>
  <div class="flex justify-center mt-10">
    <div class="form-container">
      <p class="title">Мои задачи</p>
      <table class="task-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(task, index) in tasks" :key="task.id">
            <td>{{ index + 1 }}</td>
            <td>{{ task.title }}</td>
            <td>{{ task.description }}</td>
            <td>
              <span :class="task.status === 'completed' ? 'status-completed' : 'status-not-completed'">
                {{ task.status === 'completed' ? 'Выполнено' : 'Не выполнено' }}
              </span>
            </td>
            <td class="actions">
              <button
                :class="task.status === 'completed' ? 'action-button red' : 'action-button green'"
                @click="toggleTaskStatus(task.id)"
              >
                {{ task.status === 'completed' ? '✖️' : '✔️' }}
              </button>
              <button class="action-button blue" @click="editTask(task.id)">
                ✏️
              </button>
              <button class="action-button red" @click="deleteTask(task.id)">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
  .form-container {
    width: 80%;
    max-width: 1000px;
    border-radius: 0.75rem;
    background-color: rgba(17, 24, 39, 1);
    padding: 2rem;
    color: rgba(243, 244, 246, 1);
  }

  .title {
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .task-table {
    width: 100%;
    border-collapse: collapse;
    background-color: rgba(31, 41, 55, 1);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .task-table th,
  .task-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid rgba(55, 65, 81, 1);
  }

  .task-table th {
    background-color: rgba(17, 24, 39, 1);
    font-weight: 600;
  }

  .task-table tbody tr:hover {
    background-color: rgba(55, 65, 81, 0.5);
  }

  .status-completed {
    color: #10b981; /* Зеленый цвет для статуса "Выполнено" */
    font-weight: 600;
  }

  .status-not-completed {
    color: #ef4444; /* Красный цвет для статуса "Не выполнено" */
    font-weight: 600;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-button {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1.25rem;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }

  .action-button.green {
    color: #10b981; /* Зеленый цвет для галочки */
  }

  .action-button.red {
    color: #ef4444; /* Красный цвет для крестика и мусорки */
  }

  .action-button.blue {
    color: #3b82f6; /* Синий цвет для карандаша */
  }

  .action-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
</style>