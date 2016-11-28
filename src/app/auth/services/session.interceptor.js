function SessionInterceptor($state) {
  return {
    responseError: (error) => {
      switch(error.status){
        case 400:

        case 401:

        case 403:
          console.log("403 myError");
          $state.go('layout.login');
        case 500:
      }
      return $q.reject(error);
    }
  };
}

SessionInterceptor.$inject = ['$state'];

export default {
  name: 'sessionInterceptor',
  instance: SessionInterceptor
};
