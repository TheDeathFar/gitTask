# Выбор базового образа
ARG t=14.16.1
FROM node:${t}

# Создание пользователя
ARG user=app
ARG uid=2000
ARG gid=2000
RUN groupadd --gid $gid $user \
  && useradd --uid $uid --gid $user --shell /bin/bash --create-home $user

RUN mkdir "/vsu" && chown app:app "/vsu"
USER ${user:-app}
WORKDIR /vsu

# Копируем файлы

COPY ./backend/package*.json ../backend/
COPY ./backend/common ../backend/common

ENV SERVER_ORIGIN=http://localhost:3001
ENV NODE_ENV=development


# Отмечаем порт
EXPOSE 3002

# Запуск
ENTRYPOINT npm run start