## Запуск проекта
Устанавливаем все пакеты: npm i
Копируем конфиг ormconfig.example.json => ormconfig.json и меняем необходимые поля (порт, БД и т.д.)
Запускаем команду: npx ts-node --transpile-only ./node_modules/typeorm/cli.js migration:run
Проверяем, что в БД создались все нужные таблицы (схему смотри в Confluence)
Заполняем копируем example.env => .env и заполняем
Запускаем приложение в нужном режиме: npm run start:(dev||prod)


## Работа с сидированием данных
Чтобы создать N локаций в системе, необходимо добавить две переменные в .env
TYPEORM_SEEDING_FACTORIES= *значение брать из ormconfig.example.json*
TYPEORM_SEEDING_SEEDS= *значение брать из ormconfig.example.json*
После этого необходимо указать путь до нужного сидера(ов) и запустить команду:  npm run seed:run

## Сидирование категорий
Для того, чтобы засидировать категории используйте сидер category
Категории статичны и хранятся в enum

## Сидирование локаций
Чтобы создать N локаций необходимо использовать сидер data
В файле можно изменять количество необходимых пользователей/локаций/тегов

## Генерация GralhQL схемы
npx get-graphql-schema http://localhost:3000/graphql  > schema.graphql