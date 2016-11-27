import * as angular from 'angular';
import NgMaterialModule from 'angular-material';
import NgCookie from 'angular-cookies';
import {LoginComponent} from './login';
import {RegistrationComponent} from './registration';
import {SessionService} from './services';
import {AuthService} from './services';
import ngMessages from 'angular-messages';

export default angular.module('AuthModule', [NgMaterialModule, NgCookie, ngMessages])
  .component(LoginComponent.name, LoginComponent.instance)
  .component(RegistrationComponent.name, RegistrationComponent.instance)
  .service(SessionService.name, SessionService.instance)
  .service(AuthService.name, AuthService.instance)
  .name;
