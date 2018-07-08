angular.module('Restaurant').controller('ModalController',['$scope','$uibModalInstance',function ($scope, $modal) {
      
  $scope.fnClose = () => { 
	  $modal.close();
  }

  $scope.fnCancel = () => {
	  $modal.dismiss('cancel');
  };  
    
}]);