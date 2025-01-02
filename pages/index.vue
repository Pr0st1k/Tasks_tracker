<script setup lang="ts">
  definePageMeta({
    middleware: 'auth',
  });

  const title = ref('');
  const description = ref('');
  const status = ref('not-completed');

  const handleCreateTask = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const { userId } = await $fetch('/api/token/validate-token', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      await $fetch('/api/tasks', {
        method: 'POST',
        body: {
          title: title.value,
          description: description.value,
          status: status.value,
          userId,
        },
      });

      alert('Задача успешно создана!');
      title.value = '';
      description.value = '';
      status.value = 'not-completed';
    } catch (error) {
      alert('Ошибка при создании задачи');
    }
  };
</script>

<template>
  <div class="flex justify-center mt-10">
    <div class="form-container">
      <p class="title">Добавить задачу</p>
      <form @submit.prevent="handleCreateTask" class="form">
        <div class="input-group">
          <div>
            <label for="title">Название</label>
            <input v-model="title" type="text" id="title" placeholder="" required>
          </div>
          <div class="mt-3">
            <label for="description">Описание</label>
            <input v-model="description" type="text" id="description" placeholder="" required>
          </div>
          <div class="mt-3">
            <label for="status">Статус</label>
            <select v-model="status" id="status">
              <option value="completed">Выполнено</option>
              <option value="not-completed">Не выполнено</option>
            </select>
          </div>
        </div>
        <button type="submit" class="sign mt-5">Создать</button>
      </form>
    </div>
  </div>
</template>

<style>

  html, body {
    height: -webkit-fill-available;
  }

  .form-container {
    width: 70%;
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
  }

  .form {
    margin-top: 1.5rem;
  }

  .input-group {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .input-group label {
    display: block;
    color: rgba(156, 163, 175, 1);
    margin-bottom: 4px;
  }

  .input-group input {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid rgba(55, 65, 81, 1);
    outline: 0;
    background-color: white;
    color: black;
    padding: 0.75rem 1rem;
  }

  .input-group select {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid rgba(55, 65, 81, 1);
    outline: 0;
    background-color: rgba(17, 24, 39, 1);
    color: rgba(243, 244, 246, 1);
    padding: 0.75rem 1rem;
  }

  .input-group input:focus {
    border-color: rgba(167, 139, 250);
  }

  select#status:focus {
    background-color: white;
    color: black;
    border-color: rgba(167, 139, 250);
  }

  .forgot {
    display: flex;
    justify-content: flex-end;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgba(156, 163, 175,1);
    margin: 8px 0 14px 0;
  }

  .forgot a,.signup a {
    color: rgba(243, 244, 246, 1);
    text-decoration: none;
    font-size: 14px;
  }

  .forgot a:hover, .signup a:hover {
    text-decoration: underline rgba(167, 139, 250, 1);
  }

  .sign {
    display: block;
    width: 100%;
    background-color: rgba(167, 139, 250, 1);
    padding: 0.75rem;
    text-align: center;
    color: rgba(17, 24, 39, 1);
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
  }

  .social-message {
    display: flex;
    align-items: center;
    padding-top: 1rem;
  }

  .line {
    height: 1px;
    flex: 1 1 0%;
    background-color: rgba(55, 65, 81, 1);
  }

  .social-message .message {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: rgba(156, 163, 175, 1);
  }

  .social-icons {
    display: flex;
    justify-content: center;
  }

  .social-icons .icon {
    border-radius: 0.125rem;
    padding: 0.75rem;
    border: none;
    background-color: transparent;
    margin-left: 8px;
  }

  .social-icons .icon svg {
    height: 1.25rem;
    width: 1.25rem;
    fill: #fff;
  }

  .signup {
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgba(156, 163, 175, 1);
  }

</style>