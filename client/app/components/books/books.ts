/// <reference path="../../../typings/_custom.d.ts" />

/*
 * Angular 2
 */
 import {Component, View, Directive, FormBuilder, Validators} from 'angular2/angular2';

/*
 * Directives
 * angularDirectives: Angular's core/form/router directives
 * appDirectives: Our collection of directives from /directives
 */
import {appDirectives, angularDirectives} from '../../directives/directives';

/*
 * Services
 */
import {BookService} from '../../services/BookService';

let styles   = require('./books.css');
let template = require('./books.html');

// Simple form component example
@Component({
  selector: 'books'
})
@View({
  directives: [ angularDirectives, appDirectives ],
  styles: [ styles ],
  template: template
})
export class Books {
  bookForm:  any;
  bookInput: any;
  state: any;
  constructor(
    public formBuilder: FormBuilder,
    public bookService: BookService
  ) {

    this.bookForm = formBuilder.group({
      'book': ['', Validators.required]
    });
    this.bookInput = this.bookForm.controls.book;

  }

  addBook(event, book) {
    event.preventDefault(); // prevent native page refresh

    this.bookService.add(book);
    // update the view/model
    this.bookInput.updateValue('');
  }

  removeBook(event, index) {
    event.preventDefault(); // prevent native page refresh

    this.bookService.remove(index);
  }

}
