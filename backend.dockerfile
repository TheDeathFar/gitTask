# Выбор базового образа
ARG t=14.16.1
FROM node:${t}

# Создание пользователя
ARG user=app
ARG uid=2000
ARG gid=2000
RUN groupadd --gid $gid $user \
  && useradd --uid $uid --gid $user --shell /bin/bash --create-home $user
# Создание рабочего каталога и передача прав на него
USER ${user:-app}

# Установка зависимостей
COPY --chown=app:app package*.json ./
RUN npm install

# Копируем файлы
COPY --chown=app:app ../docker .

#Устанавливаем переменные окружения
ENV MYSQL_HOST=${MYSQL_HOST:-db}
ENV JWT_SECRET_TOKEN=${JWT_SECRET_TOKEN:-your_secret_token_here}
ENV CORS_ORIGIN_REGEX=${CORS_ORIGIN_REGEX:-"http([s])?:\/\/localhost:3002"}

EXPOSE 3001

ENTRYPOINT npm run start