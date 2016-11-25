import {AuthService} from '../services';

class LoginComponent {
  styles = require('./login.component.scss');

  $state;

  authService;

  login;
  pass;
  authErrors = {};

  constructor($state, authService) {
    this.$state = $state;
    this.authService = authService;
  }

  signin() {
    this.authService.checkUser(this.login, this.pass)
      .then((data) => {
        if(data.isAuth) {
          this.$state.go('layout.address');
        } else {
          this.authErrors[data.error] = true; // ставим ошибке true
        }
      })
  }
}

LoginComponent.$inject = ['$state', AuthService.name];

export default {
  name: 'login',
  instance: {
    template: require('./login.component.pug'),
    controller: LoginComponent
  }
};
