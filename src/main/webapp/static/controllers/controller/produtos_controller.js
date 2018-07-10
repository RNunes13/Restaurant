'use strict';
angular.module('Restaurant')
.controller('ProdutosController', ['$scope', 'authService', 'appService', 'GlobalService', 'DTOptionsBuilder',
	function($scope, authService, appService, GlobalService, DTOptionsBuilder) {

		let logged = authService.login.check();
		if (!logged) return false;

		$(document).ready(function() {
			$scope.oProdutos.get();
		});

		/* key: header */
		$scope.oHeader = {
			title: "Produtos",
			selected: '',
			menu: {
				show: true,
				disabled: true, 
				selected: 1,
				fnRetrieve: function() {
					$scope.oHeader.selected = '';
					this.selected = 1;
					$scope.oProdutos.get();
				},
				fnCreate: function() {
					
					if (!authService.permission.check(authService, 2)) return false;
					
					let main = $scope.oProdutos;					
						main.this = '';
						main.form.disabled = false;
						main.form.btn.this = angular.copy(main.form.btn.save);
						main.form.textarea.change();
					
					$scope.oHeader.selected = '';
					$scope.Form.$setPristine();
					this.selected = 2;
				},
				fnUpdate: function() {
					
					if (!authService.permission.check(authService, 3)) return false;

					let main = $scope.oProdutos;
					
						main.form.disabled = false;
						main.this = angular.copy($scope.oHeader.selected);
						main.form.btn.this = angular.copy(main.form.btn.saved);
						main.form.textarea.change();

					this.selected = 3;

				},
				fnDelete: function() {
					
					if (!authService.permission.check(authService, 4)) return false;

					let oProduto = $scope.oHeader.selected;

					let title = "<h4 style='color: #C03423;'><i class='fa fa-trash'></i> Excluir</h4>";
					let text = "Deseja excluir o registro? <br/><br/>" +
							   "<strong>Código:</strong> "+ oProduto.id + "<br/>" +
							   "<strong>Nome:</strong> " + oProduto.name;
				
			
					alertify.confirm(title,text,$scope.oProdutos.delete,null).set('labels', {ok:'SIM', cancel:'NÃO'});

				}
			}
		};
		
		/* key: produtos */
		$scope.oProdutos = {
			
			this: '',
			form: {
				disabled: false,
				textarea: {
					bind: '',
					class: 'text-secondary',
					change: () => {
						
						let oTextarea = $scope.oProdutos.form.textarea;
						let oThis = angular.copy($scope.oProdutos.this);
						
						let nCharactersUsed = oThis.description ? oThis.description.length : 0;
						let nCharactersRemaining = 1000 - nCharactersUsed;
						
						if (nCharactersRemaining > 1) {
							oTextarea.bind = nCharactersRemaining + ' caracteres restantes';
							oTextarea.class = 'text-secondary';
						} else if (nCharactersRemaining === 1) {
							oTextarea.bind = nCharactersRemaining + ' caracter restante';
							oTextarea.class = 'text-secondary';
						} else {
							oTextarea.bind = 'Limite alcançado';
							oTextarea.class = 'text-danger';
						}						
						
					}
				},
				btn: {
					this: '',
					restore: {
						name: "Restabelecer",
						icon: "fa fa-refresh",
						class: "btn btn-black",
						click: function() {
							
							let main = $scope.oProdutos;

							$scope.Form.$setPristine();

							if($scope.oHeader.menu.selected == 2){
								main.this = '';
							}else{
								main.this = angular.copy($scope.oHeader.selected);
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
								$scope.oProdutos.post();
							}else{
								$scope.oProdutos.put();
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
					init: () => {
						let oBtn = $scope.oProdutos.form.btn;
							oBtn.this = oBtn.saving;
					},
					complete: function(bSuccess = true, bDisable = true, sTextMsg) {

						let oBtn = $scope.oProdutos.form.btn;
						
						if(bSuccess){

							oBtn.this = oBtn.saved;
							$scope.oProdutos.form.disabled = bDisable;
							appService.notifIt.alert("success", sTextMsg);

						} else {

							oBtn.this = oBtn.save;
							appService.notifIt.alert("error", sTextMsg);
							
						}							
					}
				}
			},
			get: () => {

				let oTable = $scope.oProdutos.table;

				oTable.loading = true;

				GlobalService.produto.get()
				.then(function(aData) {

					oTable.instance = appService.dataTableLoad(oTable.instance, aData);
					oTable.loading = false;

				},function(error){
					appService.notifIt.alert("erro", "Falha ao consultar os registros");
					console.error(error);
					oTable.loading = false;
				});

			},
			post: () => {

				try{

					let oThis = angular.copy($scope.oProdutos.this);
						
					let oData = {
						'name': oThis.name,
						'stock': oThis.stock,						
						'unit': oThis.unit,						
						'description': oThis.description
					};

					GlobalService.produto.post(oData)
					.then(function(response){
							
						$scope.oProdutos.this = response;
						$scope.oProdutos.form.btn.complete(true, true, "Cadastrado com sucesso");

					},function(error){
						console.error(error);
						$scope.oProdutos.form.btn.complete(false, false, "Falha ao cadastrar");
					});


				}catch(exception){
					console.error(exception);
					$scope.oProdutos.form.btn.complete(false, false, "Ocorreu um erro com o serviço");
				}

			},
			put: () => {

				try{

					let oThis = angular.copy($scope.oProdutos.this);
						
					let oData = {
						'id': oThis.id,
						'name': oThis.name,
						'stock': oThis.stock,						
						'unit': oThis.unit,						
						'description': oThis.description
					};

					GlobalService.produto.put(oData)
					.then(function(response){
					
						$scope.oProdutos.form.btn.complete(true, false, "Atualizado com sucesso");

						$scope.oProdutos.this = angular.copy(response);
						$scope.oHeader.selected = angular.copy(response);

					},function(exception){
						console.error(exception);
						$scope.oProdutos.form.btn.complete(false, false, "Falha ao atualizar");
					});

				}catch(exception){
					console.error(exception);
					$scope.oProdutos.form.btn.save.complete(false, false, "Ocorreu um erro com o serviço, verifique o console");	
				}

			},
			delete: () => {

				let oProduto = $scope.oHeader.selected;

				$scope.oProdutos.table.loading = true;
							
				try {
													
					GlobalService.produto.delete(oProduto.id)
					.then(function(response){

						appService.notifIt.alert("success", "Registro excluído com sucesso");
						$scope.oHeader.menu.fnRetrieve();

					},function(error){
						console.error(exception);
						appService.notifIt.alert("error", "Ocorreu um erro na exclusão");
					});				

				} catch(e) {							
					console.log(e);
					appService.notifIt.alert("error","Ocorreu um erro no serviço");
				} finally {
					$scope.oProdutos.table.loading = false;
				}

			},
			table: {
				id: "tblProdutos",
				class: "table table-striped table-hover display responsive nowrap",			
				loading: false,
				instance: {}, 
				disableDeepWatchers: true,
				search: {
					text: "",
					column: -1,					
					change: () => {
						let oTable = $scope.oProdutos.table;
						oTable.instance = appService.dataTableSearch(oTable.instance,this.text,this.column);
					},
					click: column => {						
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
					change: () => {
						let oTable = $scope.oProdutos.table;
						oTable.instance = appService.dataTableDisplyLength(oTable.instance, this.selected);
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
						"data":"name",
						"title":"Nome",
						"class":""
					},
					{
						"data":"stock",
						"title":"Estoque",
						"class":""
					},
					{
						"data":"unit",
						"title":"Unidade",
						"class":""
					}
				],
				options: {
					dom: "iptr",
					data: "",
					responsive: true,
					order: [],
					rowCallback: appService.dataTableRowCallback("produtos")
				}
			}
			
		} 
		
		angular.element(document)
	    .unbind("dt.produtos.row.click")
		.bind("dt.produtos.row.click", (e, o) => {
			
			$scope.$apply(() => {
				$scope.oHeader.selected = angular.equals(o, $scope.oHeader.selected) ? '' : o;			
			});
				
		});

		angular.element(document)
		.unbind("dt.produtos.row.dblclick")
		.bind("dt.produtos.row.dblclick", (e, o) => {
			
			$scope.$apply(() => {
			
				$scope.oHeader.selected = angular.equals(o, $scope.oHeader.selected) ? '' : o;
				
				if ($scope.oHeader.selected) {
					$scope.oHeader.menu.fnUpdate();
				}
			
			});
	  		
		});

		$scope.$watch('oProdutos.this', oThis => {
		
			let oCopyThis = angular.copy(oThis);
			let oBtn = $scope.oProdutos.form.btn;		
			let oData = angular.copy($scope.oHeader.selected);
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