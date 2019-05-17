// ! Если модуль экспортировался через default {} - не нужны

// Объединения всех модулей
import Model from './js/model';
import View from './js/view';
import Controller from './js/controller';
import { save, load } from './js/helpers';

// import './css/app.css';
import './scss/style.scss';

// Пример импорта функции из Lodash
import { lodashMethod, standardMethod } from './js/lodash-example';
lodashMethod();
standardMethod();

// Пример использования jquery
jQuery(document).ready(function($) {
  $('body').css('background-color', 'orange');
});

const state = load(); // загружаем данные из хранилища
/*
  undefined - необходим для того, чтобы в Model произошло присваивание по умолчанию
  Если данных в локальном хранилище нет возвращается null, то тогда значение по умолчанию будет null
*/
const model = new Model(state || undefined);

/*
  В Модель появилась возможность сохранять данные.
  Как только в Моделе происходит какие-то изменения,
  срабатывает событие 'change', то функция которую отправляем
	получает хранилище (данные) - происходит пересохранения в LocalStorage.
*/

model.on('change', (changeState) => save(changeState));
/*
  Событие в Моделе this.emit('change', this.state)
  срабатывает каждый раз при изменении данных.
*/

const view = new View();

// eslint-disable-next-line no-unused-vars
const controller = new Controller(model, view);

/*
  Так как Модель может быть инициализирована с какими-то данными,
  но Представления ничего не знает, что у есть
  какие-то данные, для того чтобы при запуски Приложения,
  Представление уже обновилась и показала данные которые уже есть при загрузке
  Для этого в Контролере вызывается событие view.show(model.state)
  где model.state - это массив с задачами которые были инициализированные из
  LocalStorage - и помещены обратно в Model при загрузки приложения в момент
  создания объекта model
*/
