'use strict';
angular.module('Restaurant').controller('LoginController', ['$scope', 'GlobalService', 'appService', '$sessionStorage',
	function($scope, GlobalService, appService, $sessionStorage) {
	
		if ($sessionStorage.usuario) {
			location.href = '#/home';
			return false;
		}

		$scope.oLogin = {
			form: {
				disabled: false,
				this: {username: "RNunes", password:"@1q2w3e4r"},
				btn: {
					entrar: {
						text: "Entrar",
						icon: "fa fa-sign-in"
					},
					autenticar: {
						text: "Autenticando",
						icon: "fa fa-spinner fa-pulse"
					},
					this: null
				},
				viewPass: {
					show: false,
					icon: "fa fa-eye",
					click: () => {

						let eSenha =  document.querySelector('input[name="Senha"]');

						if (this.show) { //NÃO MOSTRAR SENHA
							this.icon = "fa fa-eye";
							this.show = !this.show;
							eSenha.type = "password";

						} else { //MOSTRAR SENHA
							this.icon = "fa fa-eye-slash";
							this.show = !this.show;
							eSenha.type = "text";
						}
					}			
				},
				autenticar: () => {

					let oForm = $scope.oLogin.form;

					GlobalService.usuario.login.get(oForm.this)
					.then(function(oData) {
				
						if (!oData) {
							
							appService.notifIt.alert("warning", "Login inválido, verifique os dados informados");
							
						} else if (oData.status === 0) {

							appService.notifIt.alert("warning", "Login inativo");

						} else {
							
							appService.notifIt.alert("success", "Login aceito, aguarde...", 3000);
							
							GlobalService.liberacaoComponente.getByUser(oData.id)
							.then(function(response){
								
								let componentes = [];
								
								if (response) {
									
									response.forEach(liberacao => {
										liberacao.componentPermissionCompl.component.permission = liberacao.permission;
										componentes.push(liberacao.componentPermissionCompl.component);
									});
									
								}								
								
								let oStorage = {
									usuario: oData,
									componentes: componentes
								}
								
								$sessionStorage.restaurant = oStorage;
								
								$('.limite').delay("2000").fadeOut("slow");
								
								setTimeout(() => {									
									
									appService.load();
									location.href = '#/home';
									//appService.notifIt.remove();
									
								}, 3000);								

							}, function (response){
								
								appService.notifIt.alert("error", "Falha ao consultar componentes");
								oForm.disabled = false;
								oForm.btn.this = angular.copy(oForm.btn.entrar);
								
							});
							
						}

						oForm.disabled = false;
						oForm.btn.this = angular.copy(oForm.btn.entrar);

					}, function (error) {

						appService.notifIt.alert("error", "Falha ao autenticar");
						oForm.disabled = false;
						oForm.btn.this = angular.copy(oForm.btn.entrar);

					});

				}
			}
		};

		$scope.oLogin.form.btn.this = angular.copy($scope.oLogin.form.btn.entrar);
		
		$("#FrmLogin").iForm({
			Submit: function(Json){

				let oForm = $scope.oLogin.form;
				
				oForm.disabled = true;
				oForm.btn.this = angular.copy(oForm.btn.autenticar);
				oForm.autenticar();
				
			},
			Error: function (Input,sMsg){
				
				AuthService.Alerta("error", sMsg);

			}
		});

		$('.content-wrapper').css("margin-left", "0px");
		console.clear();
	
}]);