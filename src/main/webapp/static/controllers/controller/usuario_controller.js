'use strict';
angular.module('Restaurant')
.controller('UsuarioController', ['$scope', 'authService', 'appService', 'GlobalService', 'DTOptionsBuilder', '$filter', '$sessionStorage',
	function($scope, authService, appService, GlobalService, DTOptionsBuilder, $filter, $session) {

		let logged = authService.login.check();
		
		if (!logged) return false;
	
		$(document).ready(function() {
			$scope.oUsers.get();
		});

		$scope.userLogged = $session.restaurant.usuario;

		$scope.oHeader = {
			title: "Usuários",
			selected: '',
			menu: {
				show: true,
				disabled: true, 
				selected: 1,
				fnRetrieve: function() {
					$scope.oHeader.selected = '';
					this.selected = 1;
					$scope.oUsers.get();
				},
				fnCreate: function() {
					$scope.oUsers.this = '';
					$scope.oHeader.selected = '';
					$scope.oUsers.form.disabled = false;
					$scope.oUsers.form.btn.this = angular.copy($scope.oUsers.form.btn.save);
					$scope.Form.$setPristine();
					this.selected = 2;
				},
				fnUpdate: function() {

					let main = $scope.oUsers;
					this.selected = 3;

					main.form.disabled = false;
					main.this = angular.copy($scope.oHeader.selected);
					main.form.btn.this = angular.copy(main.form.btn.saved);
					main.this.createdAt = appService.dateTimeLocal(main.this.createdAt);
					main.this.updatedAt = appService.dateTimeLocal(main.this.updatedAt);

				},
				fnDelete: function() {

					let oUser = $scope.oHeader.selected;

					let title = "<h4 style='color: #C03423;'><i class='fa fa-trash'></i> Excluir</h4>";
					let text = "Deseja excluir o usuário? <br/><br/>" +
							   "<strong>Código:</strong> "+ oUser.id + "<br/>" +
							   "<strong>Nome:</strong> " + oUser.name;
				
			
					alertify.confirm(title,text,$scope.oUsers.delete,null).set('labels', {ok:'SIM', cancel:'NÃO'});

				}
			}
		};

		$scope.oUsers = {
			aStatus: [
				{label:"Ativo",value:1},
				{label:"Inativo",value:0}
			],
			aRule: [
				{label:"Administrador",value:1},
				{label:"Garçom",value:2},
				{label:"Cozinheiro",value:3},
				{label:"Caixa",value:4},
				{label:"Cliente",value:5}
			],
			this: '',
			form: {
				disabled: false,
				btn: {
					this: '',
					restore: {
						name: "Restabelecer",
						icon: "fa fa-refresh",
						class: "btn btn-black",
						click: function() {
							
							let main = $scope.oUsers;

							$scope.Form.$setPristine();

							if($scope.oHeader.menu.selected == 2){
								main.this = '';
							}else{
								main.this = angular.copy($scope.oHeader.selected);
								main.this.createdAt = appService.dateTimeLocal(main.this.createdAt);
								main.this.updatedAt = appService.dateTimeLocal(main.this.updatedAt);
							}
						}
					},
					save: {
						name: "Salvar",
						icon: "fa fa-floppy-o",
						class: "btn btn-success",
						disabled: false,
						click: function() {
							if($scope.oHeader.menu.selected == 2){
								$scope.oUsers.post();
							}else{
								$scope.oUsers.put();
							}
						}
					},
					saving: {
						name: "Salvando...",
						icon: "fa fa-spinner fa-pulse",
						class: "btn btn-black",
						disabled: true
					},
					saved: {
						name: "Salvo",
						icon: "fa fa-check",
						class: "btn btn-success",
						disabled: true
					},
					init: function() {
						let oBtn = $scope.oUsers.form.btn;
							oBtn.this = oBtn.saving;
					},
					complete: function(bSuccess = true, bDisable = true, sTextMsg) {

						let oBtn = $scope.oUsers.form.btn;
						
						if(bSuccess){

							oBtn.this = oBtn.saved;
							$scope.oUsers.form.disabled = bDisable;
							appService.notifIt.alert("success", sTextMsg);

						} else {

							oBtn.this = oBtn.save;
							appService.notifIt.alert("error", sTextMsg);
							
						}
					
					}								
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
			},
			get: function(){

				let oTable = $scope.oUsers.table;

				oTable.loading = true;

				GlobalService.usuario.get()
				.then(function(aData) {

					oTable.instance = appService.dataTableLoad(oTable.instance, aData);
					oTable.loading = false;

				},function(error){
					appService.notifIt.alert("erro", "Falha ao consultar usuários");
					console.error(error);
					oTable.loading = false;
				});

			},
			post: function() {

				try{

					let oThis = angular.copy($scope.oUsers.this);
					
					let oData = {
						'email': oThis.email,
						'name': oThis.name,
						'username': oThis.username,
						'password': oThis.password,
						'rule': oThis.rule,
						'status': oThis.status
					};

					GlobalService.usuario.post(oData)
					.then(function(response){
						
						response.createdAt = appService.dateTimeLocal(response.createdAt);
						response.updatedAt = appService.dateTimeLocal(response.updatedAt);
						
						$scope.oUsers.this = response;
						$scope.oUsers.form.btn.complete(true, true, "Cadastrado com sucesso");

					},function(error){
						console.error(error);
						$scope.oUsers.form.btn.complete(false, false, "Falha ao cadastrar");
					});


				}catch(exception){
					console.error(exception);
					$scope.oUsers.form.btn.complete(false, false, "Ocorreu um erro com o serviço");	
				}

			},
			put: function() {

				try{

					let oThis = angular.copy($scope.oUsers.this);
					
					let oData = {
						'id': oThis.id,
						'email': oThis.email,
						'name': oThis.name,
						'username': oThis.username,
						'password': oThis.password,
						'rule': oThis.rule,
						'status': oThis.status 		
					};

					GlobalService.usuario.put(oData)
					.then(function(response){
						
						$scope.oUsers.form.btn.complete(true, false, "Atualizado com sucesso");

						response.createdAt = appService.dateTimeLocal(response.createdAt);
						response.updatedAt = appService.dateTimeLocal(response.updatedAt);

						$scope.oUsers.this = response;
						$scope.oHeader.selected = response;

						if (oData.id === $scope.userLogged.id) {
							$session.restaurant.usuario = response;
							appService.infoUserHeader();
						}

					},function(exception){
						console.error(exception);
						$scope.oUsers.form.btn.complete(false, false, "Falha ao atualizar");
					});


				}catch(exception){
					console.error(exception);
					$scope.oUsers.form.btn.save.complete(false, false, "Ocorreu um erro com o serviço, verifique o console");	
				}

			},
			delete: function() {

				let oUser = $scope.oHeader.selected;

				$scope.oUsers.table.loading = true;
						
				try {
							
					GlobalService.usuario.delete(oUser.id)
					.then(function(response){

						appService.notifIt.alert("success", "Usuário excluído com sucesso");
						$scope.oHeader.menu.fnRetrieve();

					},function(error){
						console.error(exception);
						appService.notifIt.alert("error", "Ocorreu um erro na exclusão");
					});

				} catch(e) {							
					console.log(e);
					appService.notifIt.alert("error","Ocorreu um erro no serviço");
				}

			},
			table: {
				id: "tblUsuarios",
				class: "table table-striped table-hover display responsive nowrap",			
				loading: false,
				instance: {}, 
				disableDeepWatchers: true,
				search: {
					text: "",
					column: -1,					
					change: function() {
						let oTable = $scope.oUsers.table;
						oTable.instance = appService.dataTableSearch(oTable.instance,this.text,this.column);
					},
					click: function(column){						
						this.column = column;
						this.change();						
					}
				},
				step:{
					selected: 10,
					options: [
					{label:"10",value:10},
					{label:"15",value:15},
					{label:"25",value:25},
					{label:"50",value:50},
					{label:"Todos",value:-1}
					],
					change: function(){
						let oTable = $scope.oUsers.table;
						oTable.instance = appService.dataTableDisplyLength(oTable.instance, this.selected);
					}
				},
				columns: [
					{
						"data":"",
						"orderable": false,
						"render": function(){
							return "";
						}
					},
					{
						"data":"id",
						"title":"Código",
						"class":"text-center"
					},
					{
						"data":"name",
						"title":"Nome",
						"class":""
					},
					{
						"data":"email",
						"title":"E-mail",
						"class":""
					},
					{
						"data":"createdAt",
						"title":"Data Cadastro",
						"class":"",
						"render": function(data){
							return $filter('date')(data,'dd/MM/yyyy HH:mm:ss');
						}
					},
					{
						"data":"username",
						"title":"Login",
						"class":""
					},
					{
						"data":"rule",
						"title":"Tipo",
						"class":"",
						"render": function(data){
						
							let Data;
	
							switch(data){
								case 1: Data = "Administrador"; break;
								case 2: Data = "Garçom"; break;
								case 3: Data = "Cozinheiro"; break;
								case 4: Data = "Caixa"; break;
								case 5: Data = "Cliente"; break;
								default: Data = "--"; break;
							}
	
							return Data;
	
						}
					},
					{
						"data":"status",
						"title":"Status",
						"class":"text-center",
						"render": function(data){
							
							let Data;
	
							switch(data){
								case 1: Data = "Ativo"; break;
								case 0: Data = "Inativo"; break;
								default: Data = "--"; break;
							}
	
							return Data;
	
						}
					},
				],
				options: {
					dom: "iptr",
					data: "",
					responsive: true,
					order: [],
					rowCallback: appService.dataTableRowCallback("usuarios")
				}
			}

		};

		angular.element(document)
	    .unbind("dt.usuarios.row.click")
		.bind("dt.usuarios.row.click",function(e, o){
			
			$scope.$apply(function(){			
				$scope.oHeader.selected = angular.equals(o, $scope.oHeader.selected) ? '' : o;			
			});
				
		});

		angular.element(document)
		.unbind("dt.usuarios.row.dblclick")
		.bind("dt.usuarios.row.dblclick",function(e, o){
			
			$scope.$apply(function(){
			
				$scope.oHeader.selected = angular.equals(o, $scope.oHeader.selected) ? '' : o;
				
				if ($scope.oHeader.selected) {
					$scope.oHeader.menu.fnUpdate();
				}
			
			});
	  		
		});

		$scope.$watch('oUsers.this',function(oThis){
		
			let oCopyThis = angular.copy(oThis);
			let oBtn = $scope.oUsers.form.btn;
		
			let oData = angular.copy($scope.oHeader.selected);

			if (oData.createdAt) {
				oData.createdAt = appService.dateTimeLocal(oData.createdAt);
				oData.updatedAt = appService.dateTimeLocal(oData.updatedAt);
			}

			let bEquals;

			//QUANDO oDATA = "" E oCopyThis = "" É UM CADASTRO, SE NÃO, É UMA EDIÇÃO
			if (!oData && !oCopyThis) {
				bEquals = false;
			} else {
				bEquals = angular.equals(oCopyThis, oData);
			}
			
			if (!bEquals) {
				oBtn.this = oBtn.save;
			} else {
				oBtn.this = oBtn.saved;
			}

		},true);

	}]);