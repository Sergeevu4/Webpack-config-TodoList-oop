// # Функция для создания DOM - элементов
function createElement(tag, props, ...children) {
  const element = document.createElement(tag);

  Object.keys(props).forEach((key) => {
    // Необходимая проверка для того чтобы задать кастомный атрибут data-id
    if (key.startsWith('data-')) {
      element.setAttribute(key, props[key]);
    } else {
      element[key] = props[key];
    }
  });

  children.forEach((child) => {
    if (typeof child === 'string') {
      child = document.createTextNode(child);
    }

    element.appendChild(child);
  });

  return element;
}

// ! Механизм работы с ручными событиями (искусственные события построенные на функциях обратного вызова)
/*
    * Паттерн Publish/subscribe ~ pub/sub (публикация и подписка)
    Один из методов реализации паттерна: EventEmittet ->
    (абстракция через которую разные части программы могут взаимодействовать).

    Он - позволяет создавать объект, навешивать на него несколько обработчиков событий.
    Каждое событие имеет имя и массив обработчиков.
    EventEmittet - доступен из разных частей программы, одни навешиваться на событие,
    а другие могут emitet это событие (присылать) и когда они присылают это событие, то
    все кто подписан на эти события получают вызов функции(данные).

    Пример отображения объекта
    events {
      'add': [callback, callback] - массив из функций
      'edit': [callback, callback]
    }
*/

class EventEmittet {
  constructor() {
    this.events = {};
  }

  // # Метод для подписки на события
  on(type, callback) {
    // type - тип события на которое нужно подписаться
    // callback - функция обработчик

    // Необходимо проверить есть ли данный тип события в events
    this.events[type] = this.events[type] || [];
    this.events[type].push(callback);
  }

  // # Метод для отправки события
  emit(type, arg) {
    // type - тип события которые необходимо запустить
    // arg - переданные данные

    // Проверка есть ли что вызывать
    if (this.events[type]) {
      // Все функции в определенного типа событий, будут последовательно вызваны
      this.events[type].forEach((callback) => callback(arg));
    }
  }

  /* Происходит подпись on: я передаю название события, и функцию которая должна сработать
		при вызове данного имени, то есть срабатывает отправки события emit с переданным аргументом
	*/
}

// # Функция для сохранения данных в Локальное хранилище
function save(data) {
  const string = JSON.stringify(data);
  localStorage.setItem('todos', string);
}

// # Функция для загрузки данных их Локального хранилище
function load() {
  const string = localStorage.getItem('todos');
  const data = JSON.parse(string);

  return data;
}

// Функции save и load используются в модули index

export { createElement, EventEmittet, save, load };
