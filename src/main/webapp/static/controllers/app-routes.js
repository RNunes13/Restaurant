(function(){
	angular.module('Restaurant').config(['$routeProvider', function($routeProvider){
		
		$routeProvider
			.when('/', {
				redirectTo: "/login"
			})
			.when('/categoriaProduto', {
				templateUrl: 'static/views/categoria_produto_view.html',
				controller: 'CategoriaProdutoController'
			})
			.when('/home', {
				templateUrl: 'static/views/home_view.html',
				controller: 'HomeController'
			})
			.when('/login', {
				templateUrl: 'static/views/login_view.html',
				controller: 'LoginController'
			})
			.when('/logout', {
				templateUrl: 'static/views/logout_view.html',
				controller: 'LogoutController'
			})
			.when('/perfil', {
				templateUrl: 'static/views/perfil_usuario_view.html',
				controller: 'PerfilUsuarioController'
			})
			.when('/tipoProduto', {
				templateUrl: 'static/views/tipo_produto_view.html',
				controller: 'TipoProdutoController'
			})
			.when('/usuarios', {
				templateUrl: 'static/views/usuario_view.html',
				controller: 'UsuarioController'
			})
			.otherwise({
				templateUrl: 'static/views/notfound_view.html',
				controller: 'NotFoundController',
				redirectTo: "/404"
			});

	}]);
})();