import {AuthService} from '../services';

class RegistrationComponent {
  styles = require('./registration.component.scss');

  $state;
  authService;

  login;
  pass;
  secondPass;

  registrationErrors = {};

  constructor($state, authService) {
    this.$state = $state;
    this.authService = authService;
  }

  clearErrorArray() {
    for (var key in this.registrationErrors) {
      this.registrationErrors[key] = false;
    }
  }

  select() {
    this.clearErrorArray();
    if(this.pass !== this.secondPass){
      this.registrationErrors["notSamePass"] = true;
    } else {
      this.authService.registrationUser(this.login, this.pass)
        .then((data) => {
          if(data.isRegistration) {
            this.$state.go('layout.login');
          } else {
            this.registrationErrors[data.error] = true; // ставим ошибке true
          }
        })
    }


  }
}




RegistrationComponent.$inject = ['$state', AuthService.name];

export default {
  name: 'registration',
  instance: {
    template: require('./registration.component.pug'),
    controller: RegistrationComponent
  }
};
