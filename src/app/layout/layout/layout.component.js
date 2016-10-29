class LayoutComponent {
  styles = require('./layout.component.scss');
}

LayoutComponent.$inject = [];

export default {
  name: 'layout',
  instance: {
    template: require('./layout.component.pug'),
    controller: LayoutComponent
  }
};
