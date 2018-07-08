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
					appService.infoUserHeader();
					appService.alterMenuActive();
					return true;
					
				}
				
			}
			
		},
		
		permission: {
			
			get: () => {
				
				let aComponentes = $session.restaurant.componentes;
				let sHash = window.location.hash;
				let nPermission;
				
				aComponentes.forEach(componente => {
					if (componente.url === sHash) nPermission = componente.permission;
				});
				
				return nPermission;
				
			},
			
			check: (self, nPermission) => {
				
				let nUserPermission = self.permission.get();
				
				if (nUserPermission < nPermission) {
					self.permission.alert();
					return false;					
				} else {
					return true;					
				}
				
				
			},
			
			alert: () => {
				
				let title = "<h4 style='color: #CCB81E;'><i class='fa fa-exclamation-triangle'></i> OPSS...</h4>";
				let text = "Infelizmente você não possui a permissão necessária para acessar esta operação...";
				
				alertify.alert(title,text);
				
			}
			
			
		}
	}	

}]);
		