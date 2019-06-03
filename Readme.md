# TodoList-oop

Пример тестовой WebPack сборки на примере TodoList.
TodoList - написан в стиле ООП, ES6, используются два паттерна (MVС, pub/sub).

**Сборка WebPack состоит из 3 файлов:**

```
webpack-config
    ├── webpack.common.config.js - общая для режима development и production
    ├── webpack.dev.config.js - development
    └── webpack.prod.config.js - production
```

_На проекте используется **babel 7**, в настройках которого включены полифилы
для работы с ie 11_.

Подключены две библиотеки:

- jquery
- lodash

**Для облегченного использования Lodash добавлены npm пакеты:**<br/>

_babel-plugin-lodash_ - облегченного импорта отдельных функций.<br/>
_lodash-webpack-plugin_ - существенно сокращает размер импортируемых функций,
но урезает часть функциональности.

**Оптимизация изображений:**<br/>
Сжатие изображений, конвертирование в формат WEBP, вынесены из основной сборки,
для оптимизации времени на компиляцию, в отдельный скрипт: **_image.min.js_**.

Исходные изображений, помещаются в папку: **_original-media_**

```
original-media
  ├── svg
  └── ... - файлы jpg, jpeg, png
```

Оптимизированные изображения помещаются в итоговую папку: **_public_**

```
public
  └── img
      ├── svg
      ├── webp
      └── ... - файлы jpg, jpeg, png
```

**Работа с GIT**:<br/>
Благодаря плагинам husky и lint-staged:
В момент пре-коммита происходит запуск линтеров:

- eslint
- stylelint

Помимо проверки, происходит сортировка свойства scss и css, в заданном порядке:<br/>
**_.stylelintrc-format_**

**Для ускорения написания scss или css - есть две настройки stylelint:**

```
stylelintrc - используется при написании кода
stylelintrc-format - в момент пре-коммита

```

---

```
npm i - установка всех зависимостей

npm run lint-test - eslint проверка на возможные ошибки (js)
npm run lint-fix - eslint исправления ошибок (js)
npm run style-test - stylelint проверка на возможные ошибки (scss)
npm run style-fix - stylelint исправления ошибок (scss)
npm run dev - запуск WebPack в режиме dev (Разработка)
npm run build - запуск WebPack в режиме prod (Сборка)
npm run deploy - загрузка скомпилированной папки Public, на GitHub Pages
npm run image-min - оптимизация изображений
```
