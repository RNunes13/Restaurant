"use strict";

angular.module('Restaurant').factory('GlobalService', function(app, $http, $q) {
	
	return {
		
		componente: {
			
			get: () => {
				return app.submit('GET', '/component/getAll');
			},
			
			getById: id => {
				return app.submit('GET', '/component/' + id);
			},
			
			post: oData => {
				return app.submit('POST', '/component/', oData);
			},
			
			postList: oData => {
				return app.submit('POST', '/component/registerList/', oData);
			},
			
			put: oData => {
				return app.submit('PUT', '/component/', oData);
			},
			
			delete: (id) => {
				return app.submit('DELETE', '/component/' + id);
			}
			
		},
		
		liberacaoComponente: {
			
			get: () => {
				return app.submit('GET', '/componentPermission/getAll');
			},
			
			getByUserComponent: (id_user, id_component) => {
				return app.submit('GET', '/componentPermission/' + id_user + '/' + id_component);
			},
			
			getByUser: id => {
				return app.submit('GET', '/componentPermission/' + id);
			},
			
			post: oData => {
				return app.submit('POST', '/componentPermission/', oData);
			},
			
			postList: oData => {
				return app.submit('POST', '/componentPermission/registerList/', oData);
			},
			
			put: oData => {
				return app.submit('PUT', '/componentPermission/', oData);
			},
			
			delete: (id_user, id_component) => {
				return app.submit('DELETE', '/componentPermission/' + id_user + '/' + id_component);
			}
			
		},
		
		usuario: {
			
			get: () => {
				return app.submit('GET', '/user/getAll');
			},
			
			getById: id => {
				return app.submit('GET', '/user/' + id);
			},
			
			checkUsername: username => {
				return app.submit('GET', '/user/checkUsername/' + username);
			},
			
			checkEmail: email => {
				return app.submit('POST', '/user/checkEmail/', email);
			},
			
			post: oData => {
				return app.submit('POST', '/user/', oData);
			},
			
			put: oData => {
				return app.submit('PUT', '/user/', oData);
			},
			
			delete: id => {
				return app.submit('DELETE', '/user/' + id);
			},
			
			login: {
				
				get: oData => {
					return app.submit('GET', '/user/login/' + oData.username + '/' + oData.password)
				}
				
			}
	
		}
		
	}
	
});