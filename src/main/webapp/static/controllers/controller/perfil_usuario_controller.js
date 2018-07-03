'use strict';
angular.module('Restaurant')
.controller('PerfilUsuarioController', ['$scope', '$sessionStorage', 'GlobalService', 'appService', 'authService',
	function($scope, $session, GlobalService, appService, authService) {

	let logged = authService.login.check();
	
	if (!logged) return false;

	$scope.oPerfilUsuario = {

		data: null,
		this: null,
		form: {
			disabled: false,
			aTipos: [
				{label:"Administrador",value:1},
				{label:"Garçom",value:2},
				{label:"Cozinheiro",value:3},
				{label:"Caixa",value:4},
				{label:"Cliente",value:5}
			],
			aStatus: [
				{label:"Ativo",value:1},
				{label:"Inativo",value:0}
			],
			btn: {
				restabelecer: {
					text: "Restabelecer",
					icon: "fa fa-refresh",
					class: "btn btn-black",
					click: () => {
						
						let oUser = $scope.oPerfilUsuario;
						
						oUser.this = angular.copy(oUser.data);
						oUser.this.createdAt = appService.dateTimeLocal(oUser.this.createdAt);
						oUser.this.updatedAt = appService.dateTimeLocal(oUser.this.updatedAt);
						$scope.Form.$setPristine();
						
					}
				},
				salvar: {
					disabled: false,
					text: "Salvar",
					icon: "fa fa-floppy-o",
					class: "btn btn-success",
					click: () => {

						let oUser = $scope.oPerfilUsuario;
							oUser.form.disabled = true;

						let oData = {
							'id': oUser.this.id,
							'email': oUser.this.email,
							'name': oUser.this.name,
							'username': oUser.this.username,
							'password': oUser.this.password,
							'rule': oUser.this.rule,
							'status': oUser.this.status
						}

						GlobalService.usuario.put(oData)
						.then(function(response) {
							
							$session.restaurant.usuario = response;
							
							$scope.fnCopyDataUser();
							
							appService.infoUserHeader();
							
							oUser.form.disabled = false;
							oUser.form.btn.salvar.reset(true);
							appService.notifIt.alert("success", "Dados atualizados com sucesso");

						}, function (response) {

							appService.notifIt.alert("error", "Falha ao salvar os dados");
							oUser.form.disabled = false;
							oUser.form.btn.salvar.reset(false);

						});

					},
					reset: function(bSaved = false) {

						let oBtn = $scope.oPerfilUsuario.form.btn;

						if(bSaved){
							oBtn.this = oBtn.salvo;
						}else{
							oBtn.this = oBtn.salvar;
						}

					}
				},
				salvando: {
					disabled: true,
					text: "Salvando",
					icon: "fa fa-spinner fa-pulse",
					class: "btn btn-success"
				},
				salvo: {
					disabled: true,
					text: "Salvo",
					icon: "fa fa-check",
					class: "btn btn-success"
				},
				fechar: {
					text: "Fechar",
					icon: "fa fa-times",
					class: "btn btn-danger"
				},
				this: null
			},
			viewPass: {
				show: false,
				icon: "fa fa-eye",
				click: function() {

					let self = this;
					let eSenha =  document.querySelector('input[name="senha"]');

					if (self.show) { //NÃO MOSTRAR SENHA
						self.icon = "fa fa-eye";
						self.show = !self.show;
						eSenha.type = "password";

					} else { //MOSTRAR SENHA
						self.icon = "fa fa-eye-slash";
						self.show = !self.show;
						eSenha.type = "text";
					}
				}			
			}
		}

	};

	$scope.oPerfilUsuario.form.btn.this = $scope.oPerfilUsuario.form.btn.salvo;

	$scope.fnCopyDataUser = function() {
		
		let oUser = $scope.oPerfilUsuario;
		
		oUser.data = angular.copy($session.restaurant.usuario);
		oUser.this = angular.copy(oUser.data);
		oUser.this.createdAt = appService.dateTimeLocal(oUser.this.createdAt);
		oUser.this.updatedAt = appService.dateTimeLocal(oUser.this.updatedAt);
	};

	if ($session.restaurant.usuario) {
		$scope.fnCopyDataUser();
	} else {
		return false;
	}

	$scope.$watch('oPerfilUsuario.this',function(oThis){

		let oCopyThis = angular.copy(oThis);
			oCopyThis.createdAt = oCopyThis.createdAt.getTime();
			oCopyThis.updatedAt = oCopyThis.updatedAt.getTime();
		
		let oData = angular.copy($scope.oPerfilUsuario.data);
		let bSaved = angular.equals(oCopyThis,oData);
		
		$scope.oPerfilUsuario.form.btn.salvar.reset(bSaved);
		
	},true);

}]);