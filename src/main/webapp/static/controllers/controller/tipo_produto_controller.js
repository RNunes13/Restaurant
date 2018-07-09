'use strict';
angular.module('Restaurant')
.controller('TipoProdutoController', ['$scope', 'authService', 'appService', 'GlobalService', 'DTOptionsBuilder',
	function($scope, authService, appService, GlobalService, DTOptionsBuilder) {

		let logged = authService.login.check();
		if (!logged) return false;

		$(document).ready(function() {
			$scope.oTipoProduto.get();
		});

		/* key: header */
		$scope.oHeader = {
			title: "Tipo Produto",
			selected: '',
			menu: {
				show: true,
				disabled: true, 
				selected: 1,
				fnRetrieve: function() {
					$scope.oHeader.selected = '';
					this.selected = 1;
					$scope.oTipoProduto.get();
				},
				fnCreate: function() {
					
					if (!authService.permission.check(authService, 2)) return false;
					
					$scope.oTipoProduto.this = '';
					$scope.oHeader.selected = '';
					$scope.oTipoProduto.form.disabled = false;
					$scope.oTipoProduto.form.btn.this = angular.copy($scope.oTipoProduto.form.btn.save);
					$scope.Form.$setPristine();
					this.selected = 2;
				},
				fnUpdate: function() {
					
					if (!authService.permission.check(authService, 3)) return false;

					let main = $scope.oTipoProduto;
					
						main.form.disabled = false;
						main.this = angular.copy($scope.oHeader.selected);
						main.form.btn.this = angular.copy(main.form.btn.saved);

					this.selected = 3;

				},
				fnDelete: function() {
					
					if (!authService.permission.check(authService, 4)) return false;

					let oTipoProduto = $scope.oHeader.selected;

					let title = "<h4 style='color: #C03423;'><i class='fa fa-trash'></i> Excluir</h4>";
					let text = "Deseja excluir o registro? <br/><br/>" +
							   "<strong>Código:</strong> "+ oTipoProduto.id + "<br/>" +
							   "<strong>Nome:</strong> " + oTipoProduto.name;
				
			
					alertify.confirm(title,text,$scope.oTipoProduto.delete,null).set('labels', {ok:'SIM', cancel:'NÃO'});

				}
			}
		};
		
		/* key: tipo produto */
		$scope.oTipoProduto = {
			
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
							
							let main = $scope.oTipoProduto;

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
								$scope.oTipoProduto.post();
							}else{
								$scope.oTipoProduto.put();
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
						let oBtn = $scope.oTipoProduto.form.btn;
							oBtn.this = oBtn.saving;
					},
					complete: function(bSuccess = true, bDisable = true, sTextMsg) {

						let oBtn = $scope.oTipoProduto.form.btn;
						
						if(bSuccess){

							oBtn.this = oBtn.saved;
							$scope.oTipoProduto.form.disabled = bDisable;
							appService.notifIt.alert("success", sTextMsg);

						} else {

							oBtn.this = oBtn.save;
							appService.notifIt.alert("error", sTextMsg);
							
						}							
					}
				}
			},
			import: {
				value: "",
				btn: {
					this: '',
					importar: {
						class: 'btn btn-sm btn-block btn-black',
						bind: 'Importar',
						icon: 'fa fa-upload',
						disabled: false,
						click: () => {
							
							if (!authService.permission.check(authService, 2)) return false;
							$(".btn-import").val("").trigger("click");
						}
					},
					importando: {
						class: 'btn btn-sm btn-block btn-black',
						bind: 'Importando ...',
						icon: "fa fa-spinner fa-pulse",
						disabled: true
					},
					
					init: () => {

						let oBtn = $scope.oTipoProduto.import.btn;
							oBtn.this = angular.copy(oBtn.importando);
							
						if (!$scope.$$phase) {
							$scope.$digest();
						}
						
					},
					complete: (bSuccess = true, sMsg, showAlert = true) => {
						
						let oBtn = $scope.oTipoProduto.import.btn;
							oBtn.this = angular.copy(oBtn.importar);

						if (!$scope.$$phase) {
							$scope.$digest();
						}
							
						if (!showAlert) return false;
						
						if (bSuccess) {
							appService.notifIt.alert("success","Importado com sucesso");
						} else {
							appService.notifIt.alert("error", sMsg);							
						}
												
					}
					
				},
				
				change: (oFile) => {
					
					let title;
					let text;
					let hasHeader;
					let fileType = oFile.name.split('.');
						fileType = fileType[fileType.length - 1];
					
					if (fileType != "csv" && fileType != "txt") {
						
						title = "<h4 style='color: #CCB81E;'><i class='fa fa-exclamation-triangle'></i> OPSS...</h4>";
						text = "A extensão do arquivo escolhido não é válida. Para que a importação seja realizada, " +
							   "o arquivo deve estar no formato <strong>TXT</strong> ou <strong>CSV</strong>.";
						
						alertify.alert(title, text);							
						return false;
					}
					
					function fnYes() { $scope.oTipoProduto.import.execute(oFile, true); }
					function fnNo() { $scope.oTipoProduto.import.execute(oFile, false); }
					
					title = "<h4>Importação de arquivo</h4>";
					text = "Este arquivo possui um cabeçalho que identifica a informação de cada coluna?<br/><br/>" +
						   "<strong>OBS:</strong> Se você fechar está janela ou clicar fora dela, a respota será " +
						   "definida como '<strong>NÃO</strong>'.";
					
					alertify.confirm(title,text, fnYes, fnNo).set('labels', {ok:'SIM', cancel:'NÃO'});

				},
				
				execute: (oFile, hasHeader) => {
					
					let oBtn = $scope.oTipoProduto.import.btn;
					let reader = new FileReader();
					let content;
					let aRows;
					let aData = new Array();
					
					oBtn.init();
					
					reader.onload = function (e) {
			        	
			        	content = e.target.result;
			        	
			        	//console.log(JSON.stringify(content))
			        	
			        	if (content) {
			        		
			        		if(content.indexOf("\r\n") >= 0){
			        			aRows = content.split("\r\n");
				        	}else if(content.indexOf("\n\r") >= 0){
				        		aRows = content.split("\n\r");
				        	}else if(content.indexOf("\n") >= 0){
				        		aRows = content.split("\n");
				        	}else if(content.indexOf("\r") >= 0){
				        		aRows = content.split("\r");
				        	}else{
				        		aRows = [content];
				        	}
			        		
			        		if (aRows.length) {
			        			
			        			let aRowsInvalid = new Array();
			        			
			        			aRows.forEach((r,i) => {
			        				
			        				if (hasHeader && i === 0) return;
			        				
			        				if (r.length === 0) {
			        					return;
			        				}
			        				else if (r.length > 60) {
			        					
			        					let line = hasHeader ? i+2 : i+1
			        					
			        					aRowsInvalid.push(line);
			        					return;
			        				}
			        				
			        				let oData = {
			        					"name": r.trim()
			        				}
			        				
			        				aData.push(oData);
			        				
			        			});
			        			
			        			if (aData.length) {
			        				
			        				GlobalService.tipoProduto.postList(aData)
									.then(response => {
										
										if (aRowsInvalid.length) {
											
											oBtn.complete(null, null, false);
				        					
				        					let sLines = aRowsInvalid.join(', ');
				        					let title = "<h4 style='color: #12B700;'><i class='fa fa-check'></i> Importação concluída</h4>"
				        					let text = "A importação foi finalizada, e alguns dados não foram cadastrados, " +
				        							   "pois estão inválidos. O tamanho máximo de cada informação é de 60 caracteres.<br/><br/>" +
				        							   "Abaixo estão as linhas que apresentaram problemas na importação.<br/><br/>" +
				        							   sLines + ".";
				        					
				        					alertify.alert(title, text);
				        					
				        					
				        				} else {
				        					oBtn.complete();
				        				}
										
										$scope.oTipoProduto.get();
																
									}, exception => {
										console.error(exception);
										oBtn.complete(false, 'Falha ao cadastrar os dados importados');
									});
			        				
			        			} else {
			        				
			        				if (aRowsInvalid.length) {
			        					
			        					oBtn.complete(null, null, false);
			        					
			        					let title = "<h4 style='color: #CCB81E;'><i class='fa fa-exclamation-triangle'></i> OPSS...</h4>"
			        					let text = "Não há registros válidos para importar.<br/><br/>" +
			        							   "Verificando o conteúdo do arquivo, os dados estão inválidos. " +
			        							   "O tamanho máximo de cada informação é de 60 caracteres.";
			        					
			        					alertify.alert(title, text);
			        					
			        					
			        				} else {
			        					oBtn.complete(false, 'Não há registros para importar')
			        				}
			        				
			        				
			        			}
			        			
			        		} else {
			        			
			        			oBtn.complete(false, "O arquivo está vazio");
			        		}
			        		
			        	} else {
			        		
			        		oBtn.complete(false, "O arquivo está vazio");
			        		
			        	}
			        	
					}
					
					reader.readAsText(oFile);
					
				}
			},
			get: function(){

				let oTable = $scope.oTipoProduto.table;

				oTable.loading = true;

				GlobalService.tipoProduto.get()
				.then(function(aData) {

					oTable.instance = appService.dataTableLoad(oTable.instance, aData);
					oTable.loading = false;

				},function(error){
					appService.notifIt.alert("erro", "Falha ao consultar os registros");
					console.error(error);
					oTable.loading = false;
				});

			},
			post: function() {

				try{

					let oThis = angular.copy($scope.oTipoProduto.this);
						
					let oData = {
						'name': oThis.name
					};

					GlobalService.tipoProduto.post(oData)
					.then(function(response){
							
						$scope.oTipoProduto.this = response;
						$scope.oTipoProduto.form.btn.complete(true, true, "Cadastrado com sucesso");

					},function(error){
						console.error(error);
						$scope.oTipoProduto.form.btn.complete(false, false, "Falha ao cadastrar");
					});


				}catch(exception){
					console.error(exception);
					$scope.oTipoProduto.form.btn.complete(false, false, "Ocorreu um erro com o serviço");	
				}

			},
			put: function() {

				try{

					let oThis = angular.copy($scope.oTipoProduto.this);
						
					let oData = {
						'id': oThis.id,
						'name': oThis.name
					};

					GlobalService.tipoProduto.put(oData)
					.then(function(response){
					
						$scope.oTipoProduto.form.btn.complete(true, false, "Atualizado com sucesso");

						$scope.oTipoProduto.this = angular.copy(response);
						$scope.oHeader.selected = angular.copy(response);

					},function(exception){
						console.error(exception);
						$scope.oTipoProduto.form.btn.complete(false, false, "Falha ao atualizar");
					});

				}catch(exception){
					console.error(exception);
					$scope.oTipoProduto.form.btn.save.complete(false, false, "Ocorreu um erro com o serviço, verifique o console");	
				}

			},
			delete: function() {

				let oTipoProduto = $scope.oHeader.selected;

				$scope.oTipoProduto.table.loading = true;
							
				try {
													
					GlobalService.tipoProduto.delete(oTipoProduto.id)
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
					$scope.oTipoProduto.table.loading = false;
				}

			},
			table: {
				id: "tblTipoProduto",
				class: "table table-striped table-hover display responsive nowrap",			
				loading: false,
				instance: {}, 
				disableDeepWatchers: true,
				search: {
					text: "",
					column: -1,					
					change: function() {
						let oTable = $scope.oTipoProduto.table;
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
						let oTable = $scope.oTipoProduto.table;
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
					}
				],
				options: {
					dom: "iptr",
					data: "",
					responsive: true,
					order: [],
					rowCallback: appService.dataTableRowCallback("tipoProduto")
				}
			}
			
		}
		
		$scope.oTipoProduto.import.btn.this = angular.copy($scope.oTipoProduto.import.btn.importar); 
		
		angular.element(document)
	    .unbind("dt.tipoProduto.row.click")
		.bind("dt.tipoProduto.row.click", (e, o) => {
			
			$scope.$apply(() => {
				$scope.oHeader.selected = angular.equals(o, $scope.oHeader.selected) ? '' : o;			
			});
				
		});

		angular.element(document)
		.unbind("dt.tipoProduto.row.dblclick")
		.bind("dt.tipoProduto.row.dblclick", (e, o) => {
			
			$scope.$apply(() => {
			
				$scope.oHeader.selected = angular.equals(o, $scope.oHeader.selected) ? '' : o;
				
				if ($scope.oHeader.selected) {
					$scope.oHeader.menu.fnUpdate();
				}
			
			});
	  		
		});
		
		$(document).off('change', '.btn-import')
		$(document).on('change', '.btn-import', e => {
			
			let data = e.currentTarget.files;
	        
	        if (data.length){
	           
	           let oFile = data[0];
	    	   
	           $scope.oTipoProduto.import.change(oFile);
	           
	        }
			
	    });

		$scope.$watch('oTipoProduto.this', oThis => {
		
			let oCopyThis = angular.copy(oThis);
			let oBtn = $scope.oTipoProduto.form.btn;		
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