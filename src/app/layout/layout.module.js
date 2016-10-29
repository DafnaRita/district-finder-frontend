import * as angular from 'angular';
import Router from 'angular-ui-router';
import {LayoutComponent} from './layout';
import {AddressModule} from '../address';
import NgMaterialModule from 'angular-material';

export default angular.module('LayoutModule', [Router, AddressModule,NgMaterialModule])
  .component(LayoutComponent.name, LayoutComponent.instance)
  .name;
