/*
  ! Представление:
  Отвечает за внешний вид, взаимодействие с HTML, DOM.
  Он ничего не знает про класс Model, все что известно как работать
	с DOM элементами.

	! В Представлении методы разбиты на две части обработчики событий + (EventEmittet)
	которые вызываются методы у Контролера, далее Контролер общается Моделью, получает от нее данные и передает обратно их в Представление.
	Дальше срабатывает вторая часть методов которые непосредственно манипулитруют DOM

  Пример объекта задачи todo
	{
    id: уникальное значение,
    title: '',
    completed: false
  }

  Пользователь работает с Преставлением (view), точнее с элементами которые находятся
  в юрисдикции класса view.

  Один из сценарией пользовательского взаимодействия и дальнейшая обработка этих данных через
  взаимосвязь работы модулей через Controller:

    Пользователь вводит текст новой задачи и нажимает кнопку отправить (submit):
    ! 1. Внутри Представления срабатывает событие submit и callback функция this.handleAdd.bind(this)
    2. Внутри handleAdd, происходит остановка отправки данных из формы на сервер;
    3. Проверяем заполнил ли пользователь поле задачи;
    4. Получаем то, что ввел пользаватель;
    ! 5. Далее то, что ввел пользователь передается Контролеру (controller);
    6. Контролер получает данные через метод addTodo(title);
    7. Дальше на основе полученных данных, Конроллер создает объект;
    8. Далее этот объект передает в Состояние (model) и получет его обратно;
    ! 9. Далее передает этот объект обратно в Представление;
		10. На основе этих данных через метод addItem(todo) в Представлении создаются HTML - элементы;

		Для осуществления всего описанного выше, необходимо внутри Контролера подписаться на событие
		view.on('add', this.addTodo.bind(this)) в качестве обработчика (callback) отправляем метод addTodo - у Контролера.
		То есть когда внутри метода у Представления срабатывает (submit) с callback (handleAdd), необходимо
		вызвать функцию addTodo внутри controller.

		Для подписывания на события существуют Паттерн pub/sub (публикация и подписка) и его реализация EventEmittet
		Для получения методов используется наследования View от класса EventEmittet
*/

// # Импорт функция по созданию HTML - элементов + EventEmittet
import { createElement, EventEmittet } from './helpers.js';

class View extends EventEmittet {
  constructor() {
    super(); // Вызов родительского constructor EventEmittet
    this.form = document.querySelector('#todo-form');
    this.input = document.querySelector('#add-input');
    this.list = document.querySelector('#todo-list');

    this.form.addEventListener('submit', this.handleAdd.bind(this));
  }

  // # Метод создания HTML элементов через модуль (функцию) createElement
  createListItem(todo) {
    /*
			Свойство checked, у нас уже есть задача, необходимо проверить свойство checked
			У объекта todo.completed и еже согласно ему создавать checkbox: выполненным или нет.
		*/
    const checkbox = createElement('input', {
      type: 'checkbox',
      className: 'checkbox',
      checked: todo.completed ? 'checked' : '',
    });

    const label = createElement('label', { className: 'title' }, todo.title);
    const editInput = createElement('input', { type: 'text', className: 'textfield' });
    const editButton = createElement('button', { className: 'edit' }, 'Изменить');
    const removeButton = createElement('button', { className: 'remove' }, 'Удалить');

    /*
			LI -  необходимо присвоить класс completed,
				если задача выполнена + добавляем атрибут data-id = todo.id
				После добавляем все созданные HTML - элементы внутрь LI, с поледующим
				добавлением ее внутрь UL.
		*/
    const item = createElement(
      'li',
      {
        className: `todo-item${todo.completed ? ' completed' : ''}`,
        'data-id': todo.id,
      },
      checkbox,
      label,
      editInput,
      editButton,
      removeButton
    );

    // Подписаться на обработку событий:
    return this.addEventListeners(item);

    /*
      return - необходим, так как функция
      addEventListeners принимает item и его возвращает
    */
  }

  // # Метод добавления обработчиков событий
  addEventListeners(listItem) {
    // checkbox Задачи
    const checkbox = listItem.querySelector('.checkbox');
    // Кнопка редактирования задачи
    const editButton = listItem.querySelector('button.edit');
    // Кнопка удаления задачи
    const removeButton = listItem.querySelector('button.remove');

    // Обработчики событий
    checkbox.addEventListener('change', this.handelToggle.bind(this));
    editButton.addEventListener('click', this.handelEdit.bind(this));
    removeButton.addEventListener('click', this.handletRemove.bind(this));

    return listItem;
  }

  // # Handler - submit добавления задачи (Форма)
  handleAdd(evt) {
    evt.preventDefault();

    // Если поле вводе текста: Заголовка задачи пусто, будет предупреждение
    if (!this.input.value) {
      alert('Необходимо ввести название команды');
      return;
    }

    // value - то что пользователь ввел в поле
    const value = this.input.value;

    // ! add item to model
    // Метод для отправки события (унаследованный от EventEmittet)
    this.emit('add', value);
  }

  // # Handler - переключения состояния выполнения задачи
  handelToggle({ target }) {
    // target - через деструктуризацию объекта event

    // получаем родитель checkbox  -> LI
    const listItem = target.parentNode;
    // получаем значения атрибута data-id
    const id = listItem.getAttribute('data-id');
    // проверяем отмечен ли checkbox
    const completed = target.checked;

    // ! update model
    // Метод для отправки события (унаследованный от EventEmittet)
    this.emit('toggle', { id, completed });
  }

  // # Handler - редактирования задачи
  handelEdit({ target }) {
    const listItem = target.parentNode;
    const id = listItem.getAttribute('data-id');
    const label = listItem.querySelector('.title');
    const input = listItem.querySelector('.textfield');
    const editButton = listItem.querySelector('button.edit');

    // То что введено в поле
    const title = input.value;
    // Режим редактирования ДА или НЕТ
    const isEditing = listItem.classList.contains('editing');

    if (isEditing) {
      // ! update model
      // Метод для отправки события (унаследованный от EventEmittet)
      this.emit('edit', { id, title });
    } else {
      input.value = label.textContent;
      editButton.textContent = 'Сохранить';
      listItem.classList.add('editing');
    }
  }

  // # Handler - удаление задачи
  handletRemove({ target }) {
    const listItem = target.parentNode;
    const id = listItem.getAttribute('data-id');

    // ! remove item from model
    // Метод для отправки события (унаследованный от EventEmittet)
    this.emit('remove', id);
  }

  // # Метод вывода сохраненых задач
  show(todos) {
    // todos массив с задачами которые были сохранены в LocalStorage и помещены state в Модели
    todos.forEach((todo) => {
      const listItem = this.createListItem(todo);
      this.list.appendChild(listItem);
    });
  }

  // # Метод нахождения задачи
  findListItem(id) {
    /*
			У каждого элемента списка (задачи) LI - будет собственный id
			data-id = "..." -> 	id: Date.now()
		*/
    return this.list.querySelector(`[data-id="${id}"]`);
  }

  // # Метод добавления в список задач li -> ul
  addItem(todo) {
    // Тodo - объект задач, переданных через Контролер
    // Создание HTML - элемент
    const listItem = this.createListItem(todo);
    // Обнуления поля input после добавления задачи

    this.input.value = '';
    this.list.appendChild(listItem);
  }

  // # Метод переключения состояний задачи
  toggleItem(todo) {
    const listItem = this.findListItem(todo.id); // data-id = "..."
    const checkbox = listItem.querySelector('.checkbox');
    /* Менять состояние checkbox на то, которое указанно в объекте: задачи todo,
      в свойстве completed: false или true */
    checkbox.checked = todo.completed;

    if (todo.completed) {
      listItem.classList.add('completed');
    } else {
      listItem.classList.remove('completed');
    }
  }

  // # Метод изменения заголовка задачи
  editItem(todo) {
    const listItem = this.findListItem(todo.id);
    // Название задачи
    const label = listItem.querySelector('.title');

    // Кнопка редактирования задачи
    const editButton = listItem.querySelector('button.edit');

    // Этот метод сработает когда объект задачи обновиться
    // Поэтому нужно обновить состояние label
    label.textContent = todo.title;

    /*
			В процедурном подходе проводилась проверка состояния: есть ли класс editing,
			и исходя из этого происходила замена названия кнопки.
			В данном случае, так как объект приходит уже в обновленном состоянии, то есть
			необходимо обновить DOM - элемент, после обновления задачи.
			! Здесь проверок не будет - часть логики перекладывается на handelEdit
		*/

    editButton.textContent = 'Изменить';
    listItem.classList.remove('editing');
  }

  // # Метод удаления элемента списка
  removeItem(id) {
    const listItem = this.findListItem(id);
    // this.list.removeChild(listItem);
    listItem.remove();
  }
}

export default View;
