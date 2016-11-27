import * as angular from 'angular';
import {AddressComponent} from '../address';
import AddressModule from './address.module';

function AddressRoute($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('/', '/login');
  $stateProvider
    .state('layout.address',{
      url: '/address',
      //abstract: true,нельзя попасть по урлу
      component: AddressComponent.name
    });
}

AddressRoute.$inject = ['$stateProvider', '$urlRouterProvider'];

angular.module(AddressModule)
  .config(AddressRoute);
