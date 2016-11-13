import {EstimateService} from '../services';
import {ParamEnum} from '../utils';

class MapComponent {
  styles = require('./map.component.scss');

  $element;
  $q;
  $scope;
  map;
  estimateService;
  circle;
  coordSystem;
  placemarkCollection;
  district;

  constructor($element, $q, $scope, estimateService) {
    this.$element = $element;
    this.$q = $q;
    this.estimateService = estimateService;
    this.$scope = $scope;

    this._listen();
  }

  drawCircle(map, coords, radius) {

    this.circle = new ymaps.Circle([
      // Координаты центра круга.
      coords,
      // Радиус круга в метрах.
      radius
    ], {
      // Описываем свойства круга.
      // Содержимое балуна.
      //balloonContent: "Радиус круга - 10 км",
      // Содержимое хинта.
      //hintContent: "Подвинь меня"
    }, {
      // Задаем опции круга.
      // Включаем возможность перетаскивания круга.
      draggable: false,
      // Цвет заливки.
      // Последний байт (77) определяет прозрачность.
      // Прозрачность заливки также можно задать используя опцию "fillOpacity".
      fillColor: "#039af477",
      // Цвет обводки.
      strokeColor: "#039af4",
      // Прозрачность обводки.
      strokeOpacity: 0.8,
      // Ширина обводки в пикселях.
      strokeWidth: 5
    });

    // Добавляем круг на карту.
    map.geoObjects.add(this.circle);
    this.addClickListener(map, this.circle);
  }

  drawPlacemark(map, coords) {
    var placemark = new ymaps.Placemark(coords);
    map.geoObjects.add(placemark);
  }

  getSvgByParamType(type) {
    switch (type) {
      case 1:
        return 'icons/three.svg';
      case 2:
        return 'icons/price.svg';
      case 3:
        return 'icons/school.svg';
      case 4:
        return 'icons/sport.svg';
      case 5:
        return 'icons/rest.svg';
      case 6:
        return 'icons/health.svg';
      case 7:
        return 'icons/kindergartn.svg';

      default:
        return 'icons/pikachu.svg';
    }
  }

  drawPlacemarkByType(coords, type) {
    return new ymaps.Placemark(coords,
       {
        hintContent: 'Собственный значок метки',
        balloonContent: 'Это красивая метка'
      }, {
        // Опции.
        // Необходимо указать данный тип макета.
        iconLayout: 'default#image',
        // Своё изображение иконки метки.
        iconImageHref: this.getSvgByParamType(type),
        // Размеры метки.
        iconImageSize: [30, 42],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-3, -3]});
  }

  $onInit() {
    const map = this.$element.find('.map')[0];
    this.map = this.$q((resolve) => {//it's a trap. Это не map, это хитрюля promise
      ymaps.ready(() => {
        resolve();
      });
    }).then(() => {
      return new ymaps.Map(map, {
        center: [59.938275, 30.265816],
        zoom: 14,
        controls: []
      });
    });

    this.map.then((map) => {
      this.coordSystem = map.options.get('projection').getCoordSystem();
      map.behaviors.disable('dblClickZoom', 'rightMouseButtonMagnifier', 'leftMouseButtonMagnifier');
      this.addClickListener(map, map);
    });
  }

  getNorthPoint() {
    return this.coordSystem.solveDirectProblem(
      this.estimateService.getCoordinatesAsArray(),
      getDirection(0), // движемся на север
      this.estimateService.radius);
  }

  getAreaInformation(coords, kind) {
    return ymaps.geocode(coords,{//это сново хитрюля промис, не забудь
      skip: 1,
      kind: kind
    }).then((res) => {
      console.log('промис выполнился:', res);

      var iterator = res.geoObjects.getIterator(),
        object;
      object = iterator.getNext();
      return object.properties.get('name');

      /*res.geoObjects.each(function (obj) {
        console.log('obj!',obj.properties.get('name'));
        this.district = obj.properties.get('name');
      });*/
    });
  }

  addClickListener(map, obj) {
    obj.events.add('click', (e) => {
      try {
        // Получение координат щелчка
        const coords = e.get('coords');
        // Получение района
        this.getAreaInformation(coords, "district").then((district) => {
          console.log('хитрюля промис вернул:', district);
          this.estimateService.setDistrict(district);
        });
        // очистка карты
        map.geoObjects.removeAll();

        this.drawPlacemark(map, coords);

        this.estimateService.setCoordinates(coords[0], coords[1]);
        this.estimateService.setNorthPoint(this.getNorthPoint());
        this.drawCircle(map, coords, this.estimateService.radius);
      }
      catch (error) {
        // странная яндекс-ошибка, никак на нас не влияющая
      }
    });
  }

  _listen() { //ловим все эвенты с рутового эвента в данном скоупе.
    this.$scope.$on('changeRadius', (_, raduis) => {
      if (!this.circle) {
        return;
      }
      this.circle.geometry.setRadius(raduis);
      this.estimateService.setNorthPoint(this.getNorthPoint());
    });

    this.$scope.$on('estimatedArea', (_, data) => {
      this.placemarkCollection = new ymaps.GeoObjectCollection();
      console.log('here',this.placemarkCollection);
      this.map.then((map) => {
        for(const address of data.infrastructure) {
          console.log(address);
          this.placemarkCollection.add(this.drawPlacemarkByType(address.coordinates, address.type));
        }
        map.geoObjects.add(this.placemarkCollection);
      });
    })
  }
}

MapComponent.$inject = ['$element', '$q', '$scope', EstimateService.name];

export default {
  name: 'map',
  instance: {
    template: require('./map.component.pug'),
    controller: MapComponent
  }
};

function getDirection(azimuth) {
  return [Math.cos(azimuth), Math.sin(azimuth)];
}
