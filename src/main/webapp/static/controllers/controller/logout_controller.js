'use strict';
angular.module('Restaurant').controller('LogoutController', ['$sessionStorage', function($session) {
	
	if ($session.restaurant) {
		
		delete $session.restaurant;
		window.location.reload();
		
	} else {
		location.href = '#/login';
	}
	
	return false;
	
}]);