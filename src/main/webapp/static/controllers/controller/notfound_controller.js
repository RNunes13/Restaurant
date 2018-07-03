'use strict';
angular.module('Restaurant').controller('NotFoundController', ['authService', function(authService) {

	let logged = authService.login.check();
	
	if (!logged) return false;	
	
}]);