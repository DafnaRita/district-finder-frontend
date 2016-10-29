import * as angular from 'angular';
import LayoutModule from './layout.module';

function NgMaterialTheming($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('orange');
}

NgMaterialTheming.$inject = ['$mdThemingProvider'];

angular.module(LayoutModule)
  .config(NgMaterialTheming);
