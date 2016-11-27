class SessionService {
  $http;
  $rootScope;
  $q;
  $cookies;

  constructor($http, $rootScope, $q, $cookies) {
    this.$http = $http;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$cookies = $cookies;
  }

  get isAuthorized() {
    return !!this.$cookies.get('AuthToken');
  }

  get token(){ //взять содержимое куки
    return this.$cookies.get('AuthToken');
  }

  removeSession() {
    this.$cookies.remove('AuthToken');
  }
}

SessionService.$inject = ['$http', '$rootScope', '$q','$cookies'];

export default {
  name: 'sessionService',
  instance: SessionService
};
