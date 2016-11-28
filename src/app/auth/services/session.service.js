class SessionService {

  constructor($http, $rootScope, $q, $cookies) {
    this.$http = $http;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$cookies = $cookies;
  }

  checkConnection() {
    return this.$http.get('/api/check_session',{
    })
      .then((moreData)=>{
        return moreData;
      });
  }
}

SessionService.$inject = ['$http', '$rootScope', '$q','$cookies'];

export default {
  name: 'sessionService',
  instance: SessionService
};
