import {SessionService} from '../../auth';

class LayoutComponent {
  styles = require('./layout.component.scss');

  sessionService;

  constructor(SessionService) {
    this.sessionService = SessionService;
  }

  $onInit() {
    this.sessionService.checkConnection()
      .then((data) => {
        console.log("проверка сессии");
      })
  }
}

LayoutComponent.$inject = [SessionService.name];

export default {
  name: 'layout',
  instance: {
    template: require('./layout.component.pug'),
    controller: LayoutComponent
  }
};
