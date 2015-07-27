/// <reference path="../../typings/_custom.d.ts" />

import {View, Component} from 'angular2/angular2';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';
import {LoggedInRouterOutlet} from '../directives/LoggedInOutlet';
import {Home} from './home/home';
import {Login} from './login/login';
import {Signup} from './signup/signup';

let styles   = require('./app.css');
let template = require('./app.html');

@Component({
  selector: 'app'
})
@View({
  template: template,
  styles: [ styles ],
  directives: [ LoggedInRouterOutlet ]
})
@RouteConfig([
  { path: '/',       redirectTo: '/home' },
  { path: '/home',   as: 'home',   component: Home },
  { path: '/login',  as: 'login',  component: Login },
  { path: '/signup', as: 'signup', component: Signup }
])
export class App {
  constructor(public router: Router) {
  }
}
