import {EstimateService} from '../services';

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

  drawPlasemark(map, coords) {
    const myPlacemark = new ymaps.Placemark(coords);
    map.geoObjects.add(myPlacemark);
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
        map.behaviors.disable('dblClickZoom','rightMouseButtonMagnifier','leftMouseButtonMagnifier');
        console.log(this.coordSystem);
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
        map.geoObjects.removeAll();
        this.drawPlasemark(map, coords);

        this.estimateService.setCoordinates(coords[0], coords[1]);
        const northPoint = this.getNorthPoint();
        this.estimateService.setNorthPoint(northPoint);
        this.drawCircle(map, coords, this.estimateService.radius);
      }
      catch(error){
        console.log('error!!!');
        // странная яндекс-ошибка, никак на нас не влияющая
      }
    });
  }
  _listen() {
    this.$scope.$on('changeRadius',(_, raduis) => {
      if(!this.circle) {
        return;
      }
          this.circle.geometry.setRadius(raduis);
    });
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

function getDirection (azimuth) {
  return [Math.cos(azimuth), Math.sin(azimuth)];
}
