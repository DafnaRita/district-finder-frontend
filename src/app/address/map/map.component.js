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
  coords;
  coordSystem;
  placemarkCollection;
  district;
  currentHome;

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

  drawEmptyPlacemark(map, coords) {
    this.currentHome = new ymaps.Placemark(coords,  {
      }, {
        // Запретим замену обычного балуна на балун-панель.
        balloonPanelMaxMapArea: 0,
        draggable: "true",
        preset: "islands#blueStretchyIcon",
        // Заставляем балун открываться даже если в нем нет содержимого.
        openEmptyBalloon: false,
        hasBalloon: true
      }
    );
    map.geoObjects.add(this.currentHome);
  }

  drawFillPlacemark(map, coords) {
    // Создаем шаблон для отображения контента балуна
    var myBalloonLayout = ymaps.templateLayoutFactory.createClass(
      `<div class="${this.styles.template}">
         <h3>Рейтинг дома:</h3>{{properties.ourRating}}</p>
         <div class="${this.styles.item}">Адрес:{{properties.address}}</div>
         <div class="${this.styles.item}">Рейтинг1:{{properties.distrRating1}}</div>
         <div class="${this.styles.item}">Рейтинг2:{{properties.distrRating2}}</div>
         <div class="${this.styles.item}">Рейтинг3:{{properties.distrRating3}}</div>
         <div class="${this.styles.item}">Рейтинг4:{{properties.distrRating4}}</div>
         <div class="${this.styles.item}">Рейтинг5:{{properties.distrRating5}}</div>
         <div class="${this.styles.item}">
          <strong>Ближайшие метро</strong>
         </div>
          <div class="${this.styles.wrap}">
            {% for station in properties.stations %} 
              <div class="${this.styles.wrap} ${this.styles.item}">
                  [if station.color == 1 ] <figure class="${this.styles.red} ${this.styles.figure}"></figure> \ [endif] 
                  [if station.color == 2 ] <figure class="${this.styles.blue} ${this.styles.figure}"></figure> \ [endif] 
                  [if station.color == 3 ] <figure class="${this.styles.green} ${this.styles.figure}" ></figure> \ [endif] 
                  [if station.color == 4 ] <figure class="${this.styles.orange} ${this.styles.figure}" ></figure> \ [endif]  
                  [if station.color == 5 ] <figure class="${this.styles.purple} ${this.styles.figure}" ></figure> \ [endif] 
               {{station.name}}:{{station.distance}} \
              </div>
            {% endfor %} 
          </div>
       </div>
      `
    );

    this.currentHome = new ymaps.Placemark(coords,  {
        hintContent: "Кликните, чтобы узнать дополнительную информацию"
      }, {
        // Запретим замену обычного балуна на балун-панель.
        balloonPanelMaxMapArea: 0,
        draggable: "true",
        preset: "islands#blueStretchyIcon",
        // Заставляем балун открываться даже если в нем нет содержимого.
        openEmptyBalloon: false,
        balloonContentLayout: myBalloonLayout,
        balloonMinWidth: 250
      }
    );
    map.geoObjects.add(this.currentHome);
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
        this.coords = e.get('coords');
        // Получение района
        this.getAreaInformation(this.coords, "district").then((district) => {
          this.estimateService.setDistrict(district);
        });
        // очистка карты
        map.geoObjects.removeAll();

        this.drawEmptyPlacemark(map, this.coords);

        this.estimateService.setCoordinates(this.coords[0], this.coords[1]);
        this.estimateService.setNorthPoint(this.getNorthPoint());
        this.drawCircle(map, this.coords, this.estimateService.radius);
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
      this.map.then((map) => {
        for(const address of data.infrastructure) {
          this.placemarkCollection.add(this.drawPlacemarkByType(address.coordinates, address.type));
        }
        map.geoObjects.add(this.placemarkCollection);
        // удаление прошлой отметки
        map.geoObjects.remove(this.currentHome);

        this.drawFillPlacemark(map, this.coords);
        /*this.currentHome.properties.set({'ourRating':data.estimate,'address':"0",
          'distrRating1':"2", 'distrRating2':"2", 'distrRating3':"3",
          'distrRating4':"4", 'distrRating5':"5", 'distrRating6':"6", 'stationName1':"Василеостровская",
          'stationDistance1':"8", 'stationName2':"Петроградская",'stationDistance2':"10",'color':2});
      });*/
        this.currentHome.properties.set({'ourRating':data.estimate,
          address:"0",
          distrRating1:"2",
          distrRating2:"2",
          distrRating3:"3",
          distrRating4:"4",
          distrRating5:"5",
          distrRating6:"6",
          stations: [
            {
              name:"Василеостровская",
              distance: "8",
              color:3
            },
            {
              name:"Петроградская",
              distance: "100500",
              color:2
            },
          ]
        });
      });
    })
  }
}

/*
ourRating
address
distrRating1
distrRating2
distrRating3
distrRating4
distrRating5
stationName1
stationDistance1
stationName2
stationDistance2
 */

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
