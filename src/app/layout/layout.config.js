import * as angular from 'angular';
import LayoutModule from './layout.module';
import {SessionService} from '../auth';

function NgMaterialTheming($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('orange');
}

NgMaterialTheming.$inject = ['$mdThemingProvider'];

function checkAccess($rootScope, $state, $transitions, sessionService) {

  /*$transitions.onEnter({to: 'layout.**'}, (transitions) => {
    if(!sessionService.isAuthorized) {
      if(transitions.to().name === 'layout.login') {
        return true;
      }

      if(transitions.to().name === 'layout.registration') {
        return true;
      }

      return $state.target('layout.login', null, {location: true});
    } else {
      if(transitions.to().name === 'layout.address') {
        return true;
      }
      return $state.target('layout.address', null, {location: true});
    }
  })*/
}

checkAccess.$inject = ['$rootScope', '$state', '$transitions', SessionService.name];

angular.module(LayoutModule)
  .config(NgMaterialTheming)
  .run(checkAccess);
