(function(){
	'use strict';	
	angular.module('Restaurant', ['ngRoute', 'ui.bootstrap', 'ngStorage', 'datatables','datatables.buttons'])
	.service('app', ['$q', '$http', function($q, $http) {
		
    	this.sIP = '192.168.1.6';
    	this.sPort = '80';
    	this.sPath = 'restaurant_back';
    	this.sAuthentication = 'Basic ' + btoa('rnunes:@1q2w3e4r');
    	this.sContentType = 'application/json; charset=utf-8';
    	this.sBaseURL = 'http://' + this.sIP + ':' + this.sPort + '/' + this.sPath;
    	
    	this.submit = function(sMethod, sUrl, oData, sContentType = this.sContentType, sBaseURL = this.sBaseURL, sAuthorization = this.sAuthentication){
     	
     		return $http({
     			method: sMethod,
     			url: sBaseURL + sUrl,
     			data: oData,
     			headers: {
     				'Accept': '*',
     				'Content-Type': sContentType,
     				'Authorization': sAuthorization
     			}						
     		}).then(function(response){
     			return response.data;
     		},function(errResponse){
     			return $q.reject(errResponse);
     		});
     	}
                 
    }])
    .run(['$rootScope', 'DTDefaultOptions', function($rootScope, DTDefaultOptions) {
	    DTDefaultOptions.setLoadingTemplate('<small class="btn-block text-center">Carregando...</small>');
		DTDefaultOptions.setLanguageSource('static/assets/plugins/datatables/language/Portuguese-Brasil.json');
		DTDefaultOptions.setDOM('ipt');
	
		$rootScope.year = new Date();
		$rootScope.appVersion = '0.4.4';		
	
	}]);
})();