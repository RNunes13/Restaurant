"use strict";

angular.module('Restaurant').factory('GlobalService', function(app, $http, $q) {
	
	return {
		
		liberacaoComponente: {
			
			get: function() {
				return app.submit('GET', '/componentPermission/getAll');
			},
			
			getByUserComponent: function(id_user, id_component) {
				return app.submit('GET', '/componentPermission/' + id_user + '/' + id_component);
			},
			
			getByUser: function(id) {
				return app.submit('GET', '/componentPermission/' + id);
			},
			
			post: function(oData) {
				return app.submit('POST', '/componentPermission/', oData);
			},
			
			postList: function(oData) {
				return app.submit('POST', '/componentPermission/registerList/', oData);
			},
			
			put: function(oData) {
				return app.submit('PUT', '/componentPermission/', oData);
			},
			
			delete: function(id_user, id_component) {
				return app.submit('DELETE', '/componentPermission/' + id_user + '/' + id_component);
			}
			
		},
		
		usuario: {
			
			get: function() {
				return app.submit('GET', '/user/getAll');
			},
			
			getById: function(id) {
				return app.submit('GET', '/user/' + id);
			},
			
			checkUsername: function(username) {
				return app.submit('GET', '/user/checkUsername/' + username);
			},
			
			checkEmail: function(email) {
				return app.submit('POST', '/user/checkEmail/', email);
			},
			
			post: function(oData) {
				return app.submit('POST', '/user/', oData);
			},
			
			put: function(oData) {
				return app.submit('PUT', '/user/', oData);
			},
			
			delete: function(id) {
				return app.submit('DELETE', '/user/' + id);
			},
			
			login: {
				
				get: function(oData) {
					return app.submit('GET', '/user/login/' + oData.username + '/' + oData.password)
				}
				
			}
	
		}
		
	}
	
});