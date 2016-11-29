import * as angular from 'angular';
import AuthModule from './auth.module';
import {SessionInterceptor} from './services';

console.log('sessionService',SessionInterceptor.name);

angular.module(AuthModule)
  .config([
    '$httpProvider',
    $httpProvider => $httpProvider.interceptors.push(SessionInterceptor.name),
  ]);
