/// <reference path="../../typings/_custom.d.ts" />

import {bind, Inject, Injectable} from 'angular2/angular2';

// Using TypeScript we can define our state interface
interface IBook {
  value: string;
  created_at: Date;
  completed?: boolean;
}
interface IBookState {
  books: Array<IBook>
}

// We can also make a BookStore to manage cache/localStorage
let initialBookState:IBookState = {
  books: [
    { value: 'finish example', created_at: new Date() },
    { value: 'add tests',      created_at: new Date() },
    { value: 'include development environment', created_at: new Date() },
    { value: 'include production environment',  created_at: new Date() }
  ]
};

// Our Book Service that uses Store helper class for managing our state
@Injectable()
export class BookService {
  // we shouldn't access ._state or ._setState outside of the class
  _state: IBookState;
  constructor(@Inject('initialBookState') state: IBookState) {

    // our initial state
    this._state = state;
  }

  get(type?: string) {
    return (type) ? this._state[type] : this._state;
  }

  set(prop: any, value?: any) {
    // .set({ todos: [] }) one argument to replace all of the state
    // .set('todos', [])   two arguments only to replace a property in our state
    this._state = (value === undefined) ? prop : Object.assign({}, {
      [prop]: value
    });
  }

  add(value) {
    // Async call to server then save state
    var book = {
      value: value,
      created_at: new Date()
    };
    var books = this.get('books').slice(); // create array copy
    books.push(book);

    // You can use .set to replace state
    this.set('books', books);
  }

  remove(index) {
    // Async call to server then save state

    var books = this.get('books').slice(); // create array copy
    books.splice(index, 1);

    // Always Replace state
    this.set({
      books: books
    });

  }

}//BookService

// export our injectables for this module
export var bookInjectables: Array<any> = [
  bind('initialBookState').toValue(initialBookState),
  bind(BookService).toClass(BookService)
];
