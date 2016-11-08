import {ParamEnum} from '../utils';

class EstimateService {
  $http;
  $rootScope;
  $q;

  params = {
    parks: 0,
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

  northPoint;

  _radius = 500;
  _area;

  constructor($http, $rootScope, $q) {
    this.$http = $http;
    this.$rootScope = $rootScope;
    this.$q = $q;
  }

  setCoordinates(lat, lon) {
    this.coordinates.lat = lat;
    this.coordinates.lon = lon;
  }

  setNorthPoint(northPoint) {
    this.northPoint = northPoint;
  }

  getCoordinatesAsArray() {
    return [this.coordinates.lat, this.coordinates.lon];
  }

  get radius() {
    return this._radius;
  }

  set radius(value) {
    this._radius = value;
    this.$rootScope.$broadcast('changeRadius', this._radius);
  }

  getEstimatedArea() {
    this.$http.post('/get_query', this.getRestData())
     .then((response) => {
       const data = response.data;
       this.$rootScope.$broadcast('estimatedArea', data);
     });
  }

  getRestData() {
    return {
      target: {
        coordinates: [
          this.coordinates.lat,
          this.coordinates.lon
        ]
      },
      radius: this.radius,
      northPoint: this.northPoint.endPoint,
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
  }
}

EstimateService.$inject = ['$http', '$rootScope', '$q'];

export default {
  name: 'estimateService',
  instance: EstimateService
};
