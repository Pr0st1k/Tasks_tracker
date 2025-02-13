<script setup lang="ts">
  import { useTaskStore } from '~/stores/tasks';
  import { useAuthStore } from '~/stores/auth';

  definePageMeta({
    middleware: 'auth',
  });

  const taskStore = useTaskStore();
  const authStore = useAuthStore();

  onMounted(async () => {
    const { valid, userId } = await authStore.validateToken();
    if (valid && userId) {
      await taskStore.fetchTasks(userId);
    }
  });
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
          <tr v-for="(task, index) in taskStore.tasks" :key="task.id">
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
                @click="taskStore.toggleTaskStatus(task.id)"
              >
                {{ task.status === 'completed' ? '✖️' : '✔️' }}
              </button>
              <button class="action-button blue" @click="taskStore.editTask(task.id)">
                ✏️
              </button>
              <button class="action-button red" @click="taskStore.deleteTask(task.id)">
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