import * as angular from 'angular';
import NgMaterialModule from 'angular-material';
import {AddressComponent} from './address';
import {FilterComponent} from './filter';
import {MapComponent} from './map';
import {EstimateService} from './services';
import {AuthService} from '../auth';

export default angular.module('AddressModule', [
  NgMaterialModule
])
  .component(FilterComponent.name, FilterComponent.instance)
  .component(AddressComponent.name, AddressComponent.instance)
  .component(MapComponent.name, MapComponent.instance)
  .service(EstimateService.name, EstimateService.instance)
  .name;
