'use strict';

angular.module('Restaurant').factory('authService', ['appService', '$sessionStorage',	function (appService, $session){

	return {
		
		login: {
			
			check: () => {
				
				if (!$session.restaurant) {
					
					location.href = '#/login';
					return false;
					
				} else {

					appService.load();
					appService.alterMenuActive();
					return true;
					
				}
				
			}
			
		}
	}	

}]);
		