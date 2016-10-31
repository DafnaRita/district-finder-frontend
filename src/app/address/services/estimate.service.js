import {ParamEnum} from '../utils';

class EstimateService {
  $http;
  $rootScope;

  params = {
    parks: 3,
    malls: 0,
    schools: 0,
    sportCenters: 0,
    rest: 0,
    hospitals: 0,
    kindergarten: 0
  };

  coordinates = {
    lat: 0,
    lon: 0
  };

  _radius = 500;

  constructor($http, $rootScope) {
    this.$http = $http;
    this.$rootScope = $rootScope;
  }

  setCoordinates(lat, lot) {
    this.coordinates.lat = lat;
    this.coordinates.lot = lot;
  }

  get radius() {
    return this._radius;
  }

  set radius(value) {
    this._radius = value;
    this.$rootScope.$broadcast('changeRadius', this._radius);
  }

  send() {
    var data = {
      target: {
        coordinates: [
          this.coordinates.lat,
          this.coordinates.lot
        ]
      },
      radius: this.radius,
      estimateParams: [
        {
          type: ParamEnum.parks,
          importance: this.params.parks
        },
        {
          type: ParamEnum.malls,
          importance: this.params.malls
        },
        {
          type: ParamEnum.schools,
          importance: this.params.schools
        },
        {
          type: ParamEnum.sportCenters,
          importance: this.params.sportCenters
        },
        {
          type: ParamEnum.rest,
          importance: this.params.rest
        },
        {
          type: ParamEnum.hospitals,
          importance: this.params.hospitals
        },
        {
          type: ParamEnum.kindergarten,
          importance: this.params.kindergarten
        }
      ]
    };
    this.$http.post('/get_query', data);
  }
}

EstimateService.$inject = ['$http','$rootScope'];

export default {
  name: 'estimateService',
  instance: EstimateService
};
