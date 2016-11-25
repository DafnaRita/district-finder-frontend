import * as angular from 'angular';
import AuthModule from './auth.module';
import {LoginComponent} from './login';
import {RegistrationComponent} from './registration';


function AuthRoute($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('/', '/login');
  $stateProvider
    .state('layout.login',{
      url: '/login',
      //abstract: true,нельзя попасть по урлу
      component: LoginComponent.name
    })
    .state('layout.registration',{
      url: '/registration',
      //abstract: true,нельзя попасть по урлу
      component: RegistrationComponent.name
    });
}

AuthRoute.$inject = ['$stateProvider','$urlRouterProvider'];

angular.module(AuthModule)
  .config(AuthRoute);
