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
			aData: '',
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
			/* key: produtos.import */
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
						
					}
				},
				model: {
					modelo: [
						{
							Nome: "nomeProduto",
							Estoque: 99,
							Unidade: "Pacote",
							Descricao: "Uma descricao do produto, opcional. Caso nao tenha, deixe esta coluna vazia"
						}
					],
					click: () => {
						
						let aModel = angular.copy($scope.oProdutos.import.model.modelo);
						
						let csv = appService.convertArrayObjToCSV({
							data: aModel,
							delimiter: ',',
							qualifier: {
								value: '"',
								ignoreColumns: ['Estoque']
							}
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
											"Isso é importante quando há um caracter delimitador no dado, para que não ocorra a separação " +
											"de forma errada, ele deve ser envolvido com um qualificador.</p>";
							
							let header = "<p style='text-align: justify; margin-top: 15px;'><strong>Cabeçalho</strong> " + 
										 "descreve o valor que deve ser preenchido em determinada posição, logo, ele é utilizado apenas " +
										 "para auxiliar no preenchimento dos dados, e deve ser ignorado no cadastrado quando existir.</p>";
							
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
							
						let oImport = $scope.oProdutos.import;
							oImport.delimiter = null;
							oImport.qualifier.bUse = null;
							oImport.qualifier.sValue = '"';
							oImport.header = null;

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
					
					let oImport = $scope.oProdutos.import;		
						oImport.modal.instance.close();
					
					let oBtn = oImport.btn;
					let delimiter = oImport.delimiter;
					let header = oImport.header;
					let qualifier = oImport.qualifier.bUse ?oImport.qualifier.sValue : ''; 
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
			        							   "<p class='para-alertify'>Verificando o conteúdo do arquivo, com as informações escolhidas na importação, " +
			        							   "os dados estão inválidos. O tamanho máximo de cada informação e/ou a quantidade de colunas foi excedida.</p>" +
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
			/* key: produtos.export */
			export: {
				extension: '',
				aColumns: [
					{value: 0, bind: "Código"},
					{value: 1, bind: "Nome"},
					{value: 2, bind: "Estoque"},
					{value: 3, bind: "Unidade"},
					{value: 4, bind: "Descrição"}
				],
				aColumnsSelected: [],
				toggleSelection: value => {
					
					let oExport = $scope.oProdutos.export;
					let i = oExport.aColumnsSelected.indexOf(value);
					
					if (i > -1) oExport.aColumnsSelected.splice(i, 1);
					else oExport.aColumnsSelected.push(value);
					
				},
 				modal: {
					instance: '',
					view: '',
					size: 'lg',
					bOpen: false,
					open: () => {
						
						let oImport = $scope.oProdutos.export;
						
						oImport.modal.instance = $modal.open({
							templateUrl: 'static/views/modals/export_produtos_modal.html',
							controller: 'ModalController',
							backdrop: 'static',
							scope: $scope
					    });
						
						oImport.modal.bOpen = true;
						
					}
				},
				execute: () => {
					
					let oExport = $scope.oProdutos.export;
					let columns = new Array();
					
					columns = oExport.aColumnsSelected.indexOf(-1) > -1 ? [":not(.control)"] : angular.copy(oExport.aColumnsSelected);
					
					columns.sort((a, b) => {						
						return a < b ? -1 : a > b ? 1 : 0;						
					});
					
					if (oExport.extension === 'csv') oExport.csv(columns);
					else oExport.pdf(columns);
					
					$scope.oProdutos.export.modal.instance.close();
					
					oExport.extension = '';
					oExport.aColumnsSelected = [];
					
				},				
				csv: (columns) => {

					let cols = angular.copy(columns);
					let oTable = $scope.oProdutos.table.instance.DataTable;
					let aData = angular.copy($scope.oProdutos.aData);
					
					if (!aData.length) {
						appService.notifIt.alert('error', 'Não há registros para exportar');
						return false;
					}
					
					let oBtn = $scope.oProdutos.export.btn;
						oBtn.init();
											
					let oExport  = oTable.buttons.exportData({columns: cols});
					let aHead = oExport.header;
					let aBody = oExport.body;						
					
					let csv = appService.convertArrayToCSV({
						data: aBody,
						delimiter: ',',
						qualifier: {
							value: '"'
						},
						header: aHead
					});
					
					let date = new Date().toLocaleString('pt-BR').replace(/\/|:/g, '-');
						
					appService.downloadCSV({
						csv: csv,
						filename: 'ProdutosRestaurant (' + date + ').csv'
					});
					
					oBtn.complete();
					
				},
				pdf: (columns) => {
					
					let cols = angular.copy(columns);
					let oTable = $scope.oProdutos.table.instance.DataTable;
					let aData = angular.copy($scope.oProdutos.aData);
					
					if (!aData.length) {
						appService.notifIt.alert('error', 'Não há registros para exportar');
						return false;
					}
					
					let oBtn = $scope.oProdutos.export.btn;
						oBtn.init();
						
					let oExport  = oTable.buttons.exportData({columns: cols});
					let aHead = oExport.header;
					let aBody = oExport.body;

					let widths = [ 
						{col:"Código", width:40},
						{col:"Nome", width:"auto"},
						{col:"Estoque", width:70},
						{col:"Unidade", width:110},
						{col:"Descrição", width:"*"}
					];
					
					widths = widths.filter( obj => { return aHead.indexOf(obj.col) > -1 ? obj : null });
					widths = widths.map(obj => {return obj.width});					
					
					aHead = aHead.map(header => { return {text:header.toUpperCase(), fillColor:'#6D3127', color:'#FFF', fontSize:8, alignment:'center'} });
					
					aBody = aBody.map(a => { return a.map((s, i) => { return {text:""+s, fontSize:8, alignment:"left", paddingLeft:0}; }); });

					let body = new Array();
						body.push(aHead);
						body = body.concat(aBody);
					
					let logo = {
							image: 'data:image/png;base64,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',
			                width: 50
			        	};
					
					let date = new Date().toLocaleString('pt-BR');
					
					let dateGenerated = {
							text: 'Data Gerado: ' + date,
	                  	  	alignment: "left",
	                  	  	fontSize: 10,
	                  	  	margin: [0, 10, 0, 5]
						};
					
					let title = {
							text: 'Produtos',
	                  	  	alignment: "center",
	                  	  margin: [0, 0, 0, 5]
	                    };
					
					let doc = {
							pageSize: 'A4',
							pageOrientation: 'landscape',
							pageMargins: [ 50, 30, 50, 30 ],
							content: [
								logo,
								dateGenerated,
								title,
					            {
									table: {
										headerRows: 1,
										widths: widths,
					                	body: body	                        	  
									},
					            	layout: {
					            		fillColor: i => { return (i % 2 === 0) ?  '#efefef' : null; },
					      				defaultBorder: false
					            	}
					            }		
							]
						};
					
					pdfMake.createPdf(doc).download('ProdutosRestaurant.pdf');
					
					oBtn.complete();
					
				},
				btn: {
					this: '',
					exportar: {
						class: 'btn btn-sm btn-block btn-black',
						bind: 'Exportar',
						icon: 'fa fa-download',
						disabled: false,
					},
					exportando: {
						class: 'btn btn-sm btn-block btn-black',
						bind: 'Exportando ...',
						icon: "fa fa-spinner fa-pulse",
						disabled: true
					},										
					init: () => {

						let oBtn = $scope.oProdutos.export.btn;
							oBtn.this = angular.copy(oBtn.exportando);
							
						if (!$scope.$$phase) {
							$scope.$digest();
						}
						
					},
					complete: (bSuccess = true, sMsg, showAlert = true) => {
						
						let oBtn = $scope.oProdutos.export.btn;
							oBtn.this = angular.copy(oBtn.exportar);

						if (!$scope.$$phase) {
							$scope.$digest();
						}
							
						if (!showAlert) return false;
						
						if (bSuccess) {
							appService.notifIt.alert("success","Exportado com sucesso");
						} else {
							appService.notifIt.alert("error", sMsg);							
						}
												
					}
				}
			},			
			/* key: produtos.get */
			get: () => {

				let oTable = $scope.oProdutos.table;

				oTable.loading = true;

				GlobalService.produto.get()
				.then(function(aData) {

					$scope.oProdutos.aData = aData;
					oTable.instance = appService.dataTableLoad(oTable.instance, aData);
					oTable.loading = false;

				},function(error){
					appService.notifIt.alert("erro", "Falha ao consultar os registros");
					console.error(error);
					oTable.loading = false;
				});

			},
			/* key: produtos.post */
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
			/* key: produtos.put */
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
			/* key: produtos.delete */
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
			/* key: produtos.table */
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
						oTable.instance = appService.dataTableSearch(oTable.instance, oTable.search.text, oTable.search.column);
					},
					click: column => {						
						oTable.step.column = column;
						oTable.step.change();						
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
						oTable.instance = appService.dataTableDisplyLength(oTable.instance, oTable.step.selected);
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
					},
					{
						"data":"description",
						"title":"Descrição",
						"visible": false,
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
		$scope.oProdutos.export.btn.this = angular.copy($scope.oProdutos.export.btn.exportar);
		
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