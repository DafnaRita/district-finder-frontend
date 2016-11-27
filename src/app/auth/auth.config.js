import * as angular from 'angular';
import AuthModule from './auth.module';
import {SessionInterceptor} from './services';

angular.module(AuthModule)
  .config([
    '$httpProvider',
    $httpProvider => $httpProvider.interceptors.push(SessionInterceptor.name)
  ]);
