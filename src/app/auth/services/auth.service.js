class AuthService {
  $http;
  $rootScope;
  $q;

  user = {
    login: '',
    pass: ''
  };

  constructor($http, $rootScope, $q) {
    this.$http = $http;
    this.$rootScope = $rootScope;
    this.$q = $q;
  }

  checkUser(login, pass) {
    console.log("login", login);
    console.log("pass", pass);
    this.$http.post('/auth',{
      user:  {
        login: login,
        pass: pass }
    })
      .then((moreData)=>{
        return moreData.data;
      });
    /*return this.$q.resolve({
      isAuth: false,
      error: "wrongLogin"
    });*/
  }

  /*registrationUser(login, pass) {
    console.log("login", login);
    console.log("pass", pass);
    this.$http.post('/auth',{
     user:  {
     login: this.user.login,
     pass: this.user.pass }
     })
     .then((moreData)=>{
     const data = moreData.data;
     this.$rootScope.$broadcast('auth', data);
     });*/
    /*return this.$q.resolve({
      isRegistration: true,
      error: "userExist"
    });
  }*/
}

AuthService.$inject = ['$http', '$rootScope', '$q'];

export default {
  name: 'authService',
  instance:AuthService
};
