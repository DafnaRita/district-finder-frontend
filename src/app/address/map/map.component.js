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
    map.geoObjects.add(new ymaps.Placemark(coords));
  }

  getSvgByParamType(type) {
    switch (type) {
      case 0:
        return 'icons/0.svg';
      case 1:
        return 'icons/1.svg';
      case 2:
        return 'icons/2.svg';
      case 3:
        return 'icons/3.svg';
      case 4:
        return 'icons/4.svg';
      case 5:
        return 'icons/5.svg';
      case 6:
        return 'icons/6.svg';

      default:
        return 'icons/pikachu.svg';
    }
  }

  drawPlacemarkByType(map, coords, type) {
    console.log('type',type);
    console.log('getSvgByParamType',this.getSvgByParamType(type));
    map.geoObjects.add(new ymaps.Placemark(coords,
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
        iconImageOffset: [-3, -42]}));
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

  addClickListener(map, obj) {
    obj.events.add('click', (e) => {
      try {
        // Получение координат щелчка
        const coords = e.get('coords');
        console.log('координаты по клику:');
        console.log(coords);
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
    });

    this.$scope.$on('estimatedArea', (_, data) => {
      this.map.then((map) => {
        for(const address of data.infrastructure) {
          console.log(address);
          this.drawPlacemarkByType(map, address.coordinates, address.type);
        }
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
