'use strict';
angular.module('Restaurant')
.controller('UsuarioController', ['$scope', 'authService', 'appService', 'GlobalService', 'DTOptionsBuilder', '$filter', '$sessionStorage', '$uibModal',
	function($scope, authService, appService, GlobalService, DTOptionsBuilder, $filter, $session, $modal) {

		let logged = authService.login.check();
		if (!logged) return false;
					
		$(document).ready(function() {
			$scope.oUsers.get();
		});

		$scope.userLogged = $session.restaurant.usuario;

		/* key: header */
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
					
					if (!authService.permission.check(authService, 2)) return false;
					
					$scope.oUsers.this = '';
					$scope.oHeader.selected = '';
					$scope.oUsers.form.disabled = false;
					$scope.oUsers.form.btn.this = angular.copy($scope.oUsers.form.btn.save);
					$scope.Form.$setPristine();
					appService.fixNavTabActive();
					this.selected = 2;
				},
				fnUpdate: function() {
					
					if (!authService.permission.check(authService, 3)) return false;

					let main = $scope.oUsers;
					
						main.form.disabled = false;
						main.this = angular.copy($scope.oHeader.selected);
						main.form.btn.this = angular.copy(main.form.btn.saved);
						main.this.createdAt = appService.dateTimeLocal(main.this.createdAt);
						main.this.updatedAt = appService.dateTimeLocal(main.this.updatedAt);

					appService.fixNavTabActive();
					$scope.oComponentes.selected = '';
					$scope.oLibComponentes.aData = [];
					
					$scope.oLibComponentes.get();
					
					this.selected = 3;

				},
				fnDelete: function() {
					
					if (!authService.permission.check(authService, 4)) return false;

					let oUser = $scope.oHeader.selected;

					let title = "<h4 style='color: #C03423;'><i class='fa fa-trash'></i> Excluir</h4>";
					let text = "Deseja excluir o usuário? <br/><br/>" +
							   "<strong>Código:</strong> "+ oUser.id + "<br/>" +
							   "<strong>Nome:</strong> " + oUser.name;
				
			
					alertify.confirm(title,text,$scope.oUsers.delete,null).set('labels', {ok:'SIM', cancel:'NÃO'});

				}
			}
		};
		
		/* key: usuarios */
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
							main.checkEmail.isExist = false;
							main.checkUsername.isExist = false;
							main.checkUsername.invalid = false;

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
					
					GlobalService.liberacaoComponente.getByUser(oUser.id)
					.then(aData => {
						
						if(aData.length > 0) {
							
							let title = "<h4 style='color: #CCB81E;'><i class='fa fa-exclamation-triangle'></i> OPSS...</h4>";
							let text = "Este usuário possui alguns componentes vinculados, e para excluí-lo " + 
									   "será necessário remover todas as liberações existentes.";
							
							alertify.alert(title,text);
							 return false;
							
						} else {
							
							GlobalService.usuario.delete(oUser.id)
							.then(function(response){

								appService.notifIt.alert("success", "Usuário excluído com sucesso");
								$scope.oHeader.menu.fnRetrieve();

							},function(error){
								console.error(exception);
								appService.notifIt.alert("error", "Ocorreu um erro na exclusão");
							});
							
						}
						
					}, exception => {
						console.error(exception);
						appService.notifIt.alert("error", "Falha ao consultar as liberações");
					})

				} catch(e) {							
					console.log(e);
					appService.notifIt.alert("error","Ocorreu um erro no serviço");
				} finally {
					$scope.oUsers.table.loading = false;
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
						"class": "control",
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
			},
			
			checkUsername: {
				
				invalid: false,
				isExist: false,
				isAvailable: () => {
					
					let oUser = $scope.oUsers;	
					if(!oUser.this.username) return false;
					
					//Expressão que captura caracteres que não são do grupo . a-z A-Z 0-9
					let regex = /(?![\.a-zA-Z0-9]+)./g;
					
					let bTestRegex = regex.test(oUser.this.username);
					
					if (bTestRegex) {
						
						oUser.checkUsername.invalid = true;
						oUser.checkUsername.isExist = false;
						$scope.Form.$invalid = true;
						return false;
						
					} else {
						oUser.checkUsername.invalid = false;
					}
					
					GlobalService.usuario.checkUsername(oUser.this.username)
					.then(function(response) {
						
						if (response && response.username !== $scope.oHeader.selected.username) {
							$scope.Form.$invalid = true;
							oUser.checkUsername.isExist = true;	
						} else {
							oUser.checkUsername.isExist = false;
						}
						
					}, function(error) {
						appService.notifIt.alert("warning", "Falha com o serviço ao verificar disponibilidade do login");
					});
					
				}
				
			},
			
			checkEmail: {
				
				isExist: false,
				isAvailable: () => {
					
					let oUser = $scope.oUsers;	
					if(!oUser.this.email) return false;
					
					GlobalService.usuario.checkEmail(oUser.this.email)
					.then(function(response) {
						
						if (response && response.email !== $scope.oHeader.selected.email) {
							$scope.Form.$invalid = true;
							oUser.checkEmail.isExist = true;
						} else {
							oUser.checkEmail.isExist = false;
						}
						
					}, function(error) {
						appService.notifIt.alert("warning", "Falha com o serviço ao verificar disponibilidade do e-mail");
					});
					
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

		
		
		/* key: liberacao componentes */
		$scope.oLibComponentes = {			
			aData: [], //Dados registrados + Dados adicionados que não estão salvos
			aCopy: [], //Dados registrados
			selected: '',
			aPermission: [
				{value: 1, bind: 'Con'},
				{value: 2, bind: 'Con / Inc'},
				{value: 3, bind: 'Con / Inc / Alt'},
				{value: 4, bind: 'Con / Inc / Alt / Exc'}
			],
			btn: {
				delete: (obj) => {
					
					let oLib = $scope.oLibComponentes;
						oLib.selected = obj;
						
					let bSaved = false;
					
					oLib.aCopy.forEach(liberacao => {
						if(obj.id === liberacao.id) bSaved = true;
					});
					
					if (bSaved) {
						
						let title = "<h4 style='color: #C03423;'><i class='fa fa-trash'></i> Excluir</h4>";
						let text = "Deseja excluir a liberação do componente? <br/><br/>" +
								   "<strong>Código:</strong> "+ obj.id + "<br/>" +
								   "<strong>Nome:</strong> " + obj.name;
					
				
						alertify.confirm(title,text,oLib.delete,null).set('labels', {ok:'SIM', cancel:'NÃO'});
						
					} else {
						$scope.oLibComponentes.aData = $scope.oLibComponentes.aData.filter(component => {
							return component.id != oLib.selected.id;
						});
					}
										
				},
				save: () => {
					
					let oLib = $scope.oLibComponentes;	
					let oUser = $scope.oUsers.this;
					
					let aCompIds = oLib.aCopy.map(component => {return component.id})
					
					let aNew = oLib.aData.filter(component => {
						let i = aCompIds.indexOf(component.id);						
						if (i === -1 || Number(oLib.aCopy[i].permission) !== Number(component.permission)) return component;
					});
					
					
					let aData = [];
					
					aNew.forEach(componente => {
						
						if (componente.permission) {
							aData.push({
								"componentPermissionCompl": {
								      "component": {
								        "id": componente.id
								      },
								      "user": {
								        "id": oUser.id
								      }
								    },
								    "permission": Number(componente.permission)
							});
						}
						
					});
					
					if (aData.length === 0) {
						appService.notifIt.alert('warning', 'Não há liberação para salvar');
						return false;
					}
					
					$scope.oLibComponentes.post(aData);
					
				}
			},
			get: () => {
				GlobalService.liberacaoComponente.getByUser($scope.oUsers.this.id)
				.then(aData => {
					
					let aComponent = aData.map(liberacao => {
						liberacao.componentPermissionCompl.component.permission = liberacao.permission;
						return liberacao.componentPermissionCompl.component;
					})
					
					$scope.oLibComponentes.aData = angular.copy(aComponent);
					$scope.oLibComponentes.aCopy = angular.copy(aComponent);
					
				}, exception => {
					console.error(exception);
					appService.notifIt.alert('error', 'Falha ao consultar os componentes do usuário')
				});
			},
			post: (aData) => {
				
				GlobalService.liberacaoComponente.postList(aData)
				.then(() => {						

					$scope.oLibComponentes.get();
					
					if ($scope.oUsers.this.id === $scope.userLogged.id) {
						
						let title = "<h4 style='color: #12B700;'><i class='fa fa-check'></i> Liberações cadastradas</h4>";
						let text = "As liberações foram registradas com sucesso. No entanto, como você alterou seu usuário, " + 
								   "para que as alterações funcionem corretamente será necessário sair da aplicação e efetuar " +
								   "o login novamente";
						
						alertify.alert(title, text);
						
					} else {
						
						appService.notifIt.alert('success', 'Liberações registradas com sucesso');
						
					}
					
				}, exception => {
					
					console.error(exception);
					appService.notifIt.alert('error', 'Falha ao registrar as liberações');
					
				});
				
			},
			delete: () => {
				
				function removeComponent(component) {
					return component.id != oLib.selected.id;
				}
				
				let oLib = $scope.oLibComponentes;
				
				GlobalService.liberacaoComponente.delete($scope.oUsers.this.id, oLib.selected.id)
				.then(() => {
					
					if ($scope.oUsers.this.id === $scope.userLogged.id) {
						
						let title = "<h4 style='color: #12B700;'><i class='fa fa-check'></i> Liberação excluída</h4>";
						let text = "A liberação foi excluída com êxito. No entanto, como você alterou seu usuário, para " + 
								   "que as alterações funcionem corretamente será necessário sair da aplicação e efetuar " +
								   "o login novamente";
						
						alertify.alert(title, text);
						
					} else {
						
						appService.notifIt.alert('success', 'Liberação excluída com sucesso');
						
					}
					
					$scope.oLibComponentes.aData = $scope.oLibComponentes.aData.filter(removeComponent);					
					$scope.oLibComponentes.aCopy = $scope.oLibComponentes.aCopy.filter(removeComponent);
					
				}, exception => {
					console.error(exception);
					appService.notifIt.alert('error', 'Falha ao excluir a liberação');
				});
				
			}
		}
		
		/* key: componentes */
		$scope.oComponentes = {
			aData: [],
			selected: '',
			componentsNotAllowed: (aData) =>{	
				let oLib = $scope.oLibComponentes.aData;			
				let aCompIds = oLib.map(component => {return component.id})
				
				return aData.filter(component => {
					if (aCompIds.indexOf(component.id) === -1) return component;
				});
				
			},
			modal: {
				instance: '',
				view: '',
				size: 'lg',
				bOpen: false,
				open: () => {
					
					let oCom = $scope.oComponentes;
					
					oCom.modal.instance = $modal.open({
						templateUrl: 'static/views/modals/componente_modal.html',
						controller: 'ModalController',
						//backdrop: 'static',
						scope: $scope
				    });
					
					oCom.modal.bOpen = true;
					$scope.oComponentes.selected = '';
					$scope.oComponentes.get();
					
				}
			},
			get: () => {
				GlobalService.componente.get()
				.then(function(aData){
					
					$scope.oComponentes.aData = angular.copy(aData);					
					
					let aCompNotAllowed = $scope.oComponentes.componentsNotAllowed(aData);
					
					$scope.oComponentes.table.options.data = aCompNotAllowed;
					
				},function(exception){
					console.error(exception);
					appService.notifIt.alert('error', 'Falha ao consultar os componentes')
				});
			},
			table: {
				id: "tblComponentes",
				class: "table table-striped table-hover display responsive nowrap",			
				loading: false,
				instance: {}, 
				disableDeepWatchers: true,
				search: {
					text: "",
					column: -1,					
					change: () => {
						let oTable = $scope.oComponentes.table;
						oTable.instance = appService.dataTableSearch(oTable.instance, oTable.search.text, oTable.search.column);
					},
					click: column => {
						
						let oTable = $scope.oComponentes.table;
						
						oTable.search.column = column;
						oTable.search.change();						
					}
				},
				columns: [
					{
						"data":"id",
						"title":"Código",
						"class":"text-center",
						"width": "70px"
					},
					{
						"data":"icon",
						"title":"Ícone",
						"class":"text-center",
						"width": "70px",
						"render": icon => {
							return "<i class='" + icon + "'></i>";
						}
					},
					{
						"data":"name",
						"title":"Nome",
						"class":""
					}
				],
				options: {
					dom: "iptr",
					data: "",
					responsive: true,
					order: [],
					rowCallback: appService.dataTableRowCallback("componentes", true)
				}
			}
		}
		
		angular.element(document)
		.unbind("dt.componentes.row.click")
		.bind("dt.componentes.row.click", function(e, o){
			
			let oCom = $scope.oLibComponentes.aData;
			let Obj = angular.copy(o);
			
			let aComFiltered = oCom.filter(component => {
				return component.id != Obj.object.id;
			});
			
			if (Obj.selected) aComFiltered.push(Obj.object);
			
			$scope.oComponentes.selected = aComFiltered.length;			
			$scope.oLibComponentes.aData = aComFiltered;

		});
		
	}]);