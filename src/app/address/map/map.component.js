class MapComponent {
  styles = require('./map.component.scss');

  $element;
  $q;
  map;

  constructor($element, $q) {
    this.$element = $element;
    this.$q = $q;
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
        zoom: 14
      });
    });
    this.map.then((map) => {
      map.events.add('click', function (e) {
        // Получение координат щелчка
        var coords = e.get('coords');
        console.log(coords);
      });
    });

  }
}

MapComponent.$inject = ['$element', '$q'];

export default {
  name: 'map',
  instance: {
    template: require('./map.component.pug'),
    controller: MapComponent
  }
};
