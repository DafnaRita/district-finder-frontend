class EstimateService {
  $http;

  params = {
    parks: 0,
    malls: 0,
    schools: 0,
    sportCenters: 0,
    rest: 0,
    hospitals: 0,
    kindergarten: 0
  };

  constructor($http) {
    this.$http = $http;
  }
}

EstimateService.$inject = ['$http'];

export default {
  name: 'estimateService',
  instance: EstimateService
};
