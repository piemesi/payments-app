#!/usr/bin/env bash

supervisord -c /etc/supervisor/supervisord.conf
supervisorctl -c /etc/supervisor/supervisord.conf

supervisorctl reread
echo 'running supervisor processing'
supervisorctl update && supervisorctl start laravel-worker:*

echo 'running php-fpm'
php-fpm
