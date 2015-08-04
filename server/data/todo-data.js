'use strict';

var r = require('../lib/datastore');

exports.getTodosByUserId = function(userId) {
  return null;/*r.table('todos')
    .getAll(userId, {index: 'userId'})
    .run()
    .then(function(result) {
      return (result && result.length > 0) ? result[0] : null;
    });*/
};

exports.getTodo = function(todoId) {
  return null;/*r.table('todos')
    .get(todoId)
    .delete()
    .run();*/
};

exports.removeTodo = function(todoId) {
  return null;/*r.table('todos')
    .get(todoId)
    .delete()
    .run();*/
};

exports.createTodo = function(todo, userId) {
  todo.userId = userId;
  return null;/*r.table('todos')
    .insert(todo)
    .run();*/
};
