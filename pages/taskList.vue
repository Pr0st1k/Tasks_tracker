<script setup lang="ts">
  const tasks = ref([]);

  onMounted(async () => {
    const accessToken = localStorage.getItem('accessToken');
    const { userId } = await $fetch('/api/token/validate-token', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    tasks.value = await $fetch(`/api/tasks?userId=${userId}`);
  });
</script>

<template>
  <div class="flex justify-center mt-10">
    <div class="form-container">
      <p class="title">Мои задачи</p>
      <ul>
        <li v-for="task in tasks" :key="task.id" class="task-item">
            <h3>Задача № {{ task.id }}</h3>
            <h3>{{ task.title }}</h3>
            <p>{{ task.description }}</p>
          <p>Статус: {{ task.status === 'completed' ? 'Выполнено' : 'Не выполнено' }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
  .task-item {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
  }
</style>