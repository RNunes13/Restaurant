'use strict';
angular.module('Restaurant').controller('HomeController', ['appService', 'authService', function(appService, authService) {

	let logged = authService.login.check();
	
	if (!logged) return false;
	
}]);