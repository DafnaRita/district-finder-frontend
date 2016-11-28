import {AuthService} from '../services';
import {CurrentLoginPass} from '../services';

class LoginComponent {
  styles = require('./login.component.scss');

  $state;

  authService;
  CurrentLoginPass;

  login;
  pass;
  authErrors = {};

  constructor($state, authService, CurrentLoginPass) {
    this.$state = $state;
    this.authService = authService;
    this.CurrentLoginPass = CurrentLoginPass;
  }

  signin() {
    this.authService.checkUser(this.login, this.pass)
      .then((data) => {
        console.log("я тут");
        console.log(data.data);
        if(data.data.isAuth) {
          console.log("перемещаемся!");
          console.log("pass and login",
            this.pass,
            this.login);
          this.authService.user.login = this.login;
          this.authService.user.pass = this.pass;
          this.$state.go('layout.address');
        }
        if(data.data.status == 403) {
          console.log("403 ошибка");
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
