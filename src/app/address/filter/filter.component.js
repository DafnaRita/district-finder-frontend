import {EstimateService} from '../services';

class FilterComponent {
  styles = require('./filter.component.scss');
  estimateService;

  constructor(estimateService) {
    this.estimateService = estimateService;
  }

  get estimateParams() {
    return this.estimateService.params;
  }

  select() {
    console.log(this.estimateParams);
  }
}


FilterComponent.$inject = [EstimateService.name];

export default {
  name: 'filter',
  instance: {
    template: require('./filter.component.pug'),
    controller: FilterComponent
  }
};
