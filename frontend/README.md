
## TradeOffer | Frontend

Сделано с использованием React

## Как собрать Backend часть в Dockerfile

1) Образ для сборки - `node:14.16.1`
2) Установка зависимостей: скопировать в рабочую директорию все файлы, начинающиеся со слова package и выполнить запуск команды
   `npm install`
3) Из бэка необходимо забрать папку common с общими для бэка и фронта файлами
   (да, нелогично, но требование разраба)

```dockerfile
# copy common files from backend

COPY ./backend/package*.json ../backend/

RUN npm install --prefix ../backend

COPY ./backend/common ../backend/common
```

Например, как-то так это можно сделать, не копируйте бездумно, подумайте,
как это можно сделать лучше

4) Пометить открытым порт 3002
5) Скопировать файлы фронта (исходный код), не забыть по .dockerignore
6) Выполнить сборку и запуск `npm run start`

## Переменные окружения 

```dotenv
// Сервер с БД
SERVER_ORIGIN=http://localhost:3001

// Для Redux Tools, указание среды запуска (чтобы было видно отладку)
NODE_ENV=development
```

Указать в компоузе 