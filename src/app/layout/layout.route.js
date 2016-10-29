import * as angular from 'angular';
import {LayoutComponent} from './layout';
import LayoutModule from './layout.module';

function LayoutRoute($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/address');

  $stateProvider
    .state('layout', {
      url: '',
      abstract: true,
      component: LayoutComponent.name
    });
}

LayoutRoute.$inject = ['$stateProvider', '$urlRouterProvider'];

angular.module(LayoutModule)
  .config(LayoutRoute);
