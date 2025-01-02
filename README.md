Инструкция по запуску данного проекта.

1. Клонируем проект на локальную машину. 

```bash
    cd <'Путь в удобную для вас папку'>

    git clone https://github.com/Pr0st1k/Tasks_tracker.git

    cd <'Tasks_tracker'>
```

2. Установка зависимостей

```bash
    # npm
    npm install

    # pnpm
    pnpm install

    # yarn
    yarn install

    # bun
    bun install
```

3. Запуск сервера разработки

```bash
    # npm
    npm run dev

    # pnpm
    pnpm dev

    # yarn
    yarn dev

    # bun
    bun run dev
```

4. Запуск json-server

```bash
    json-server --watch db.json --port 3001
```