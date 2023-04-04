FROM php:7.4-apache

# Установка необходимых модулей
RUN docker-php-ext-install pdo pdo_mysql

# Копирование файлов проекта
COPY . /var/www/html/
