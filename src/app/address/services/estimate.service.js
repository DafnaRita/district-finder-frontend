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
  district; //по дефолту у нас Васька

  _radius = 500;

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

  setDistrict(district) {
    console.log('change in service1',district);
    this.district = district;
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
    /*для поддельного джейсона*/
    /*
    this.$q.resolve({
      "estimate": 4.5,
      "address": "5-я линия Васильевского острова, 30В",
      "districtRating":
      {
        "safety": 1,
        "life_quality": 2,
        "transport_quality": 3,
        "rest_availability": 4,
        "parks_availability": 5
      },
      "metro":[
        {
          "name": "Невский проспект",
          "distance": "1.5 км",
          "color": 2
        },
        {
          "name": "Маяковская",
          "distance": "0.5 км",
          "color": 3
        },
        {
          "name": "Чернышевская",
          "distance": "6.5 км",
          "color": 4
        }
      ],
      "infrastructure": [
        {
          "address": "Санкт-Петербург, В.О., линия 2-я, 43",
          "name": "Британская школа Ila Aspect",
          "type": 3,
          "coordinates": [
            59.94581,
            30.282747
          ]
        },
        {
          "address": "Санкт-Петербург, 5-я линия В. О., 16/17, литер А",
          "name": "Школа № 21 им. Э.П. Шаффе",
          "type": 3,
          "coordinates": [
            59.940568,
            30.284661
          ]
        },
        {
          "address": "Санкт-Петербург, В.О., Средний просп., 28/29, литера А, пом. 32Н",
          "name": "Частная школа Ювента",
          "type": 3,
          "coordinates": [
            59.943129,
            30.279325
          ]
        },
        {
          "address": "Санкт-Петербург, Волжский пер., 11",
          "name": "Православная общеобразовательная школа Семьи Шостаковичей",
          "type": 3,
          "coordinates": [
            59.940807,
            30.283232
          ]
        },
        {
          "address": "Санкт-Петербург, 6-я линия В. О., 15Литера Д",
          "name": "Частная школа Шостаковичей",
          "type": 3,
          "coordinates": [
            59.940731,
            30.281831
          ]
        },
        {
          "address": "Санкт-Петербург, 2-я линия В. О., 43",
          "name": "Британский школа Аспект",
          "type": 3,
          "coordinates": [
            59.94581,
            30.282747
          ]
        },
        {
          "address": "Санкт-Петербург, 2-я линия В. О., 43",
          "name": "НОУ Международная языковая академия Аспект Британская школа Аспект",
          "type": 3,
          "coordinates": [
            59.94581,
            30.282747
          ]
        }
      ]
    })
      .then((data) => {
        this.$rootScope.$broadcast('estimatedArea', data);
      });
*/
    /* для обычной отправки/принятия джейсона*/
    this.$http.post('/get_query', this.getRestData())
     .then((response) => {
       const data = response.data;
       this.$rootScope.$broadcast('estimatedArea', data);
     });
  }

  getMoreInfo(query) {

    this.$http.get('/get_info',{
      params:  { lat: query.address[0],
        lon: query.address[1],
        type: query.type }
    })
      .then((moreData)=>{
        const data = moreData.data;
        this.$rootScope.$broadcast('eventGetMoreInfo', data, query.idPlace);
      });
    console.log('отправлено');
    // this.$q.resolve({
    //   "name":"Детский сад № 5",
    //   "address":"Санкт-Петербург, ул. Гаванская, 56, литера Х",
    //   "url":"http://vasdou005.ucoz.ru",
    //   "phoneNumber":"+7 (812) 352-55-82 ; ",
    //   "workTime":"пн-пт 7:00–19:00",
    //   "additionalInfo":""
    // })
    //   .then((data) => {
    //     //data.add(idPlace,query.idPlace);
    //     this.$rootScope.$broadcast('eventGetMoreInfo', data,query.idPlace);
    //   });
    // console.log('отправлено');
  }

  getRestData() {
    return {
      coordinatesCurrent: [
        this.coordinates.lat,
        this.coordinates.lon
      ],
      district: this.district,
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
