class AddressComponent {
  styles = require('./address.component.scss');
}

AddressComponent.$inject = [];

export default {
  name: 'address',
  instance: {
    template: require('./address.component.pug'),
    controller: AddressComponent
  }
};
