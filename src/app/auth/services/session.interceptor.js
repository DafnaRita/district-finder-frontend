function SessionInterceptor($q, $rootScope) {
  return {
    responseError: (error) => {
      switch(error.status){
        case 400:
          $rootScope.$broadcast('Bad request', error);
          $rootScope.$broadcast('Stop session', error);
        case 401:
          $rootScope.$broadcast('Unauthorised', error);
          $rootScope.$broadcast('Stop session', error);
        case 403:
          $rootScope.$broadcast('Forbidden', error);
          $rootScope.$broadcast('Stop session', error);
        case 500:
          $rootScope.$broadcast('Server error', error);
          $rootScope.$broadcast('Stop session', error);
      }
      return $q.reject(error);
    }
  };
}

SessionInterceptor.$inject = ['$http', '$rootScope', '$q'];

export default {
  name: 'sessionInterceptor',
  instance: SessionInterceptor
};
