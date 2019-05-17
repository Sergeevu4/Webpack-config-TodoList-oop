/* eslint-disable no-console */

import _ from 'lodash';

function lodashMethod() {
  // Метод mapValues - из lodash
  const users = {
    fred: { user: 'fred', age: 40 },
    pebbles: { user: 'pebbles', age: 1 },
  };
  console.log(
    _.mapValues({ a: '', b: '', c: '' }, (val, key) => {
      return key;
    }),
    `Пример mapValues из Lodash`
  ); //  { a: 'a', b: 'b', c: 'c' }

  console.log(_.mapValues(users, (a) => a.user), `Пример mapValues из Lodash`);

  console.log(_.get({ a: { b: 5 } }, 'a.b'));
  console.log(_.get({ a: [{ b: { c: 3 } }] }, 'a[0].b.c'));
}

function standardMethod() {
  const users = {
    fred: { user: 'fred', age: 40 },
    pebbles: { user: 'pebbles', age: 1 },
  };

  // Собственная реализация функции mapValues
  function mapValues(obj, map) {
    return Object.keys(obj).reduce((all, key) => {
      all[key] = map(obj[key], key, obj);
      return all;
    }, {});
  }
  console.log(
    mapValues({ a: '', b: '', c: '' }, (val, key) => {
      return key;
    }),
    `Пример mapValues из standardMethod`
  ); //  { a: 'a', b: 'b', c: 'c' }

  console.log(
    mapValues(users, (val) => {
      return val.age;
    }),
    `Пример mapValues standardMethod`
  );
}

export { lodashMethod, standardMethod };
