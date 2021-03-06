### Payments Api
_by_ **Alexey Gaynulin** _(a@gaynulin.ru)_

**...Описание будет обновляться...**

Demo: 
   * http://task.softmade.ru

# Сервисы:
* backend:
    * nginx для php
    * superivisor (установаливается при `docker-compose up --build` и запускается вместе с контейнеров backend.php)
        * есть конфиг супервиозора, который запускае `php artisan queue:work` (хенделр очередей ларавела)
    * задания в очередь - необходимы для заданий (о них также ниже `laravel/php/src/app/Jobs/`):
        * подвтерждения транзакций
        * создание csv файла (асинхронно)
    * laravel 5.6, php ^7.1, postgres, очереди (пока используется бд), кэш (можно через redis, можно через бд - необходимо указать нужное имя container_name из docker-compose.yaml)
* frontend:
    * webpack, react, redux
* postgres
* redis
* nginx 
    * nginx для laravel
    * общий балансер (например, для масштабирования микросервисной архитекруры)
    

# Методы Api
* Все доступны со стороны frontend'a:
   * `frontend/src/src/api/index.js`
* Со стороны backend'a:
   * `laravel/php/src/routes/api.php`
* `Content/type: application/json`
* Демо `apiPrefix` = http://task.softmade.ru
* Список:
   * get(`${apiPrefix}/api/account/`); // получение списка аккаунтов пользователей (users+wallets)
   * get(`${apiPrefix}/api/countries/`); // 
   * get(`${apiPrefix}/api/cities/`); 
   * get(`${apiPrefix}/api/currencies/`); // список доступных валют
   * get(`${apiPrefix}/api/currency-rate/`); // список соотношения валют к доллару (группировка последнего сохраненного по каждой валюте
   * get(`${apiPrefix}/api/report/${statId}/csv`); // получение csv по сформированному отчету (statId) - см. следующий запрос
   * get(`${apiPrefix}/api/account/${email}/report/?${addParams.join('&')}`, {date_from, date_to}); // формирования отчета по указанным параметрам
   * get(`${apiPrefix}/api/account/${email}/check`); // получение аккаунта по email (user+wallets)
   * post(`${apiPrefix}/api/account/`, data); // создание аккаунта (users+wallets) на основе параметров: {name[string], country_code[ex:"RUS"], city_id[int], currency_code[ex:"USD"], email, password[12345]). Если пользователь с таким email уже есть -> проверяется наличие соответствующего у него кошелька с указанной валютой - если нет -> создается соотвтетствующий кошелек.
   * post(`${apiPrefix}/api/transaction/`, data);
      * submitEnroll: {"wallet_to":INT,"amount_from":"100000","currency_from":"RUB"} // зачисление/снятие
      * submitTransfer: {"wallet_to":INT,"wallet_from":INT,"amount_from":INT} // перевод с кошелька на кошелек
   * post(`${apiPrefix}/api/currency-rate/`, data); // обновление котировок валют (сейчас все к USD) `{"currency_from":"RUB",	"source": "CBR","rate":600000,"exponent":INT[default=4]}` exponent'a нужна чтобы хранить котировки в базе как целые числа (rate делиться на 10 в указаной степени [exponent])


# DB
* вся структура db накатывается миграциями (`laravel/src/database/migrations`)
* также при запуске контейнера backend.php (`laravel/php/Dockerfile`) накатываются необходимые фикстуры данных:
    * `php artisan db:seed`
    * Currencies list, Countries, Cities, admin Wallet, Admin User, Currency Rate for USD (`database/seeds`)
![db tables](http://task.softmade.ru/tables.png)
* Таблица currency_rates:
    * поля currency_from, currency_to (сейчас всегла USD), rate, exponent..
    * exponent необходимо, чтобы указывать соотношение в целых цислах (например рубль-доллар 600000 при экспоненте==4 - т.е. делим на 10^4 при расчетах в конвертации)
* Таблицы отчтета:
    * stats - сводная таблица - кол-во транзакций по типам и статусу, общая сумма переводов и тд.
    * stat_items - подробная по всем транзакциям по всем кошелька пользователя
    * при создании таблицы отчета - они кешируются для запроса (проверяется возможность кешировани - дата окончания запроса - должна быть в прошлом - так как новые транзакции не создадутся задним числом и можно закешировать на какое-то время)
    * при создании таблицы отчета - ставится задача в очередь на создание csv асинхроно
* Таблицы транзакций:
    * transactions - сюда приходит транзакция в статусе "процессинг" со всеми данными
    * транзакции могут быть - внесение на счет (отрицание - сняти) / перевод между кошельками
    * ставится задача в очередь - на подвтерждение транзакции - также асинхроно
        *  после успешного подтверждения - обновляется сумма в кошельке/ах
    * после подтверждения - возможно подтверждение или отказ (confirmed/declined)
* Таблицы аккаунта:
    * совокупнные данные из таблиц users+wallets
    * у пользователя может быть несколько кошельков
    
    
# Структура проекта/сервисов
![db tables](http://task.softmade.ru/frontend.png)
### Frontend
    * настройка локальной сборки с (Hot Module Replacement) в `frontend/src/webpack-dev-server.config.js`
    * продакшн - `frontend/src/webpack.config.js`
    * в папке **www** -> ассеты и индекс пейдж для локальной работы
    * в node_modules -> результат `npm i` аКа `npm install` - можно `yarn install` - необходимые зависисмости
    * в папке **build/** -> результат продакшн сборки (`webpack`)
    * в папке **src** -> компоненты реакта и архитектура redux:
        * экшны в соответсвующей папке actions (список "ручек" в api/*)
        * редюсеры в папке reducers -> обрабатывают состояние Store'a (ответы от сервыера):
            * accountReducer, currencyReducer, registerReducer, transactionReducer
        * в папке routing -> инитный сыроватый роутинг.
        * в папке components -> компоненты:
            * стремление к BEMу (тут не сильно видно) - архитекутра стилей компонентов [BEM-методология](http://task.softmade.ru/frontend.png)
            * сами компоненты, говорящие за себя -> account-page, currency, register, report, wallet, welcome-page 
    * Дизайн: использовалась бибилиотека material-ui реализация концепцию material дезайна

           
![db tables](http://task.softmade.ru/services.png)    
### Backend
    * Laravel 5.6
    * Все роуты(методы апи) в `routes/api`
    * миграции и фикстуры (database/migrations ../seeds)
    * в public -> та самая папка build/ из frontend (подключается через welcome.blade)
    * Два контроллера рабочих:
        * app/Http/Controllers/AccountController
        * app/Http/Controllers/ApiController
    * Jobs (задания):
        * подтверждение транзации
        * создание csv
    * Вся основноая логика в Services, которые подключены через ServiceProviders (там еще можно дальше работать если бы надо было развивать... )
    * Services:
        * Апи методы с помощью сервиса ApiMethod -> попадают в сервис Validator
        * Сервис валидатор проверяет необходимые параметры "на вход", отслеживает поведение в сервисах (отлавливает ошибки и подгатавливает ответ)
        * Все остальные сервисы в принципе сами за себя говорят, только их нужно смотреть
        * повторюсь, там основная логика. Лучше посмотерть туда
* **`/Laravel/php/src/app/Service`**
        
       * Там - сервисы и их модели
       
    

# Запуск задания для разработки:
* для работы с проектом необходимо получить этот репозиторий и поднять сервисы через `docker-compose`
* запуск через `docker-compose` (возможны нюансы, но при корректных .env, свободных портов - должно подниматься):
    * поднимаются laravel (php + nginx)
    * postgres
    * redis
    * balancer (nginx)
    * _Возможно, включить и `frontend` сразу для поднятия в контейнере_ (как пример секция в docker-compose и в файлу frontend/Dockerfile)
* при запуске через docker-compose необходимо создать сеть:
    * `docker create paymentsnet` - create network for payments app
* при запуске выполняются установка зависимостей композера, накатываются миграции (всю структуру базы можно посмотреть в них - см. пункт База)
* backend поднимается на :85 порту 
* фронтенд запускается `cd frontend/src && npm i` - и после - `npm start`
    * поднимается на порте :3050 (см. frontend/src/webpack-dev-server.config.js)
* сборка билда (не для разработки) фронтенда осуществляется: `cd frontend/src && webpack` -> создается папка build/ (в frontend/src)
    * ассеты (js,css) из сформированной папки - сейчас просто переносятся в welcome.blade.php в laravel (опять же - можно оптимизировать - переносить при сборке)


    
**Примечание:**
Можно дорабатывать бесконечно долго. 
Сейчас основная задача стабилизировать работу на хостинге
рабочее демо со всей функциональостью валожено тут:
    http://task.softmade.ru
* в ближайшие дни на неделе в свободное время поправлю, чтобы там можно было проверить весь фукнционал. 
    По самому коду, принципиально уже ничего не измениться. Его можно смотреть. Как донастрою демо - напишу.
    
    #### Спасиб за внимание!
 
