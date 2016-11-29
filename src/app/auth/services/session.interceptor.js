function SessionInterceptor($state, $q) {
  return {
    responseError: (error) => {
      console.log("error.status", error.status);
      switch(error.status){
        case 400:
          console.log("400 myError");
          break;
        case 401:
          console.log("401 myError");
          $state.go('layout.login');
          break;
        case 403:
          console.log("403 myError");
          $state.go('layout.login');
          break;
        case 500:
          console.log("500 myError");
          break;
      }
      return $q.reject(error);
    }
  };
}

SessionInterceptor.$inject = ['$state','$q'];

export default {
  name: 'sessionInterceptor',
  instance: SessionInterceptor
};
