'use strict';
angular.module('Restaurant')
.controller('ProdutosController', ['$scope', 'authService', 'appService', 'GlobalService', 'DTOptionsBuilder', '$uibModal',
	function($scope, authService, appService, GlobalService, DTOptionsBuilder, $modal) {

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
			import: {
				delimiter: null,
				qualifier: {
					bUse: null,
					sValue: '"'
				},
				header: null,
				file: '',
				modal: {
					instance: '',
					view: '',
					size: 'lg',
					bOpen: false,
					open: () => {
						
						let oImport = $scope.oProdutos.import;
						
						oImport.modal.instance = $modal.open({
							templateUrl: 'static/views/modals/import_produtos_modal.html',
							controller: 'ModalController',
							backdrop: 'static',
							scope: $scope
					    });
						
						oImport.modal.bOpen = true;
						
					},
					close: () => {
						console.log($scope.oProdutos.import.modal.instance)
					}
				},
				model: {
					modelo: [
						{
							Nome: "nomeProduto1",
							Estoque: 99,
							Unidade: "Pacote",
							Descricao: "Uma descricao do produto, opcional. Caso nao tenha, deixe esta coluna vazia"
						},
						{
							Nome: "nomeProduto2",
							Estoque: 13,
							Unidade: "Caixa",
							Descricao: "Uma descricao do produto, opcional. Caso nao tenha, deixe esta coluna vazia"
						}
					],
					click: () => {
						
						let aModel = angular.copy($scope.oProdutos.import.model.modelo);
						
						let csv = appService.convertArrayObjToCSV({
							data: aModel
						});
						
						appService.downloadCSV({
							csv: csv,
							filename: 'ImportarProdutos(Modelo).csv'
						});
						
					}
				},
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
					ajuda: {
						class: 'btn btn-link',
						icon: 'fa fa-question-circle',
						bind: 'Ajuda',
						click: () => {
							
							let delimiter = "<p style='text-align: justify; margin-top: 15px;'><strong>Delimitador</strong> " + 
											"é quem separa os valores dentro do arquivo. Cada registro deve ser separado por linhas, " +
											"e em cada linha pode haver mais de um dado, e neste caso, um delimitador é utilizado.</p>";
							
							let qualifier = "<p style='text-align: justify; margin-top: 15px;'><strong>Qualificador</strong> " + 
											"circunscreve os valores no arquivo. Em outras palavras, ele envolve o dado como um valor. " +
											"Isso é importante quando há um caracter delimitador no dado, para que o dado não seja separado " +
											"de forma errada, ele deve ser envolvido com um qualificador.</p>";
							
							let header = "<p style='text-align: justify; margin-top: 15px;'><strong>Cabeçalho</strong> " + 
										 "descreve o valor que deve ser preenchido em determinada posição, logo, ele é utilizado apenas " +
										 "para o preenchimento dos dados, e é ignorado no cadastrado quando existir.</p>";
							
							let title = "<h4><i class='fa fa-question-circle'></i> Como importar um arquivo</h4>";
							let text = "<p style='text-align: justify; margin-bottom: 5px;'>Na importação de um arquivo algumas informações " +
									   "são importantes para determinar a separação dos dados na hora de cadastra-los. Dentre estas informações " +
									   "estão o <strong>Delimitador</strong>, <strong>Qualificador</strong> e <strong>Cabeçalho</strong>.</p>" +
									   delimiter + qualifier + header;
							
							alertify.alert(title, text);
						}
					},
					
					init: () => {

						let oBtn = $scope.oProdutos.import.btn;
							oBtn.this = angular.copy(oBtn.importando);
							
						if (!$scope.$$phase) {
							$scope.$digest();
						}
						
					},
					complete: (bSuccess = true, sMsg, showAlert = true) => {
						
						let oBtn = $scope.oProdutos.import.btn;
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
				
				change: () => {
					
					let oImport = $scope.oProdutos.import;
					let fileType = oImport.file.name.split('.');
						fileType = fileType[fileType.length - 1];
					
					if (fileType != "csv" && fileType != "txt") {
						
						let title = "<h4 style='color: #CCB81E;'><i class='fa fa-exclamation-triangle'></i> OPSS...</h4>";
						let text = "A extensão do arquivo escolhido não é válida. Para que a importação seja realizada, " +
							   "o arquivo deve estar no formato <strong>TXT</strong> ou <strong>CSV</strong>.";
						
						alertify.alert(title, text);							
						return false;
					}
					
					oImport.modal.open();

				},
				
				execute: () => {
					
					$scope.oProdutos.import.modal.instance.close();
					
					let oBtn = $scope.oProdutos.import.btn;
					let delimiter = $scope.oProdutos.import.delimiter;
					let header = $scope.oProdutos.import.header;
					let qualifier = $scope.oProdutos.import.qualifier.bUse ? $scope.oProdutos.import.qualifier.sValue : ''; 
					let reader = new FileReader();
					let content;
					let aRows;
					let aData = new Array();
					
					oBtn.init();
					
					reader.onload = function (e) {
			        	
			        	content = e.target.result;
			        	
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
			        			
			        			if (header) aRows.shift();
			        			let aRowsInvalid = new Array();			        			
			        			
			        			aRows.forEach((row, i) => {
			        							        								        				
				        			row = appService.split(row, delimiter, qualifier);
				        			
				        			if (row.length === 0) {
			        					return;
			        				}
			        				else if (row.length !== 4 || 
			        						 row[0].length > 60 || 
			        						 row[1].length > 15 || 
			        						 row[2].length > 20 || 
			        						 row[3].length > 1000) {
			        					
			        					let line = header ? i+2 : i+1
			        					
			        					aRowsInvalid.push(line);
			        					return;
			        				}
				        			
				        			let regex = /^\d+$/;				        			
				        			let stockIsValid = regex.test(row[1]);
				        			
				        			if (!stockIsValid) {
				        				
				        				let line = header ? i+2 : i+1
					        					
					        			aRowsInvalid.push(line);
					        			return;
				        				
				        			}				        			
				        			
				        			let oData = {
				        					"name": row[0],
				        					"stock": row[1],
				        					"unit": row[2],
				        					"description": row[3]
				        				}
				        				
				        			aData.push(oData);			        			
			        				
			        			});
			        			
			        			if (aData.length) {
			        							        				
			        				GlobalService.produto.postList(aData)
									.then(response => {
										
										if (aRowsInvalid.length) {
											
											oBtn.complete(null, null, false);
				        					
				        					let sLines = aRowsInvalid.join(', ');
				        					let title = "<h4 style='color: #CCB81E;'><i class='fa fa-exclamation-triangle'></i> Importação concluída</h4>"
				        					let text = "<p class='para-alertify'>A importação foi finalizada, e alguns dados não foram cadastrados, " +
				        							   "pois estão inválidos. O tamanho máximo de cada informação e/ou a quantidade de colunas foi excedida</p>" +
				        							   "<p class='para-alertify'>Antes de tentar importar novamente os dados que não foram registrados, tenha certeza que eles estão válidos. " + 
				        							   "E na importação do arquivo, escolha os campos corretos.</p>" +
				        							   "<p class='para-alertify'>Abaixo estão as linhas que apresentaram problemas na importação. Os demais dados foram cadastrados.</p>" +
				        							   sLines + ".";
				        					
				        					alertify.alert(title, text);
				        					
				        					
				        				} else {
				        					oBtn.complete();
				        				}
										
										$scope.oProdutos.get();
																
									}, exception => {
										console.error(exception);
										oBtn.complete(false, 'Falha ao cadastrar os dados importados');
									});
			        				
			        			} else {
			        				
			        				if (aRowsInvalid.length) {
			        					
			        					oBtn.complete(null, null, false);
			        					
			        					let title = "<h4 style='color: #CCB81E;'><i class='fa fa-exclamation-triangle'></i> OPSS...</h4>"
			        					let text = "<p class='para-alertify'>Não há registros válidos para importar.</p>" +
			        							   "<p class='para-alertify'>Verificando o conteúdo do arquivo, os dados estão inválidos. " +
			        							   "O tamanho máximo de cada informação e/ou a quantidade de colunas foi excedida.</p>" +
			        							   "<p class='para-alertify'>Tenha certeza que os dados estão válidos, e que os campos foram " +
			        							   "escolhidos corretamente na importação do arquivo";
			        					
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
					
					reader.readAsText($scope.oProdutos.import.file);

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
		
		$scope.oProdutos.import.btn.this = angular.copy($scope.oProdutos.import.btn.importar); 
		
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
		
		$(document).off('change', '.btn-import')
		$(document).on('change', '.btn-import', e => {
			
			let oImport = $scope.oProdutos.import;
			let data = e.currentTarget.files;
	        
	        if (data.length){
	           
	           oImport.file = data[0];
	    	   
	           oImport.change();
	           
	        }
			
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