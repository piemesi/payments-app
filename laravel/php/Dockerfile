FROM php:7.1-fpm

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN apt-get update && \
    apt-get install -y git zip wget

RUN apt-get update && \
    apt-get install -y libpq-dev mysql-client nano postgresql-client && docker-php-ext-install pdo_pgsql bcmath sockets opcache pdo pdo_mysql

RUN apt-get install -y supervisor

COPY ./supervisor/laravel-worker.conf /etc/supervisor/conf.d/laravel-worker.conf

COPY ./config/php.ini /usr/local/etc/php/

WORKDIR /app

COPY ./src /app
COPY ./supervisor/start-supervisor.sh /start/start-supervisor.sh

RUN composer install --optimize-autoloader --no-scripts
RUN chown www-data:www-data /app -R

RUN chmod -R 777 /app/storage && chmod 777 -R /app/bootstrap/cache

ONBUILD RUN php artisan cache:clear

#CMD ["php-fpm"]
CMD ["/bin/bash", "/start/start-supervisor.sh"]
