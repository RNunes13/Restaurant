angular.module('Restaurant')
.service('appService',['$uibModal', '$sessionStorage', '$filter', function($modal, $session, $filter){
	
	let that = this;
	
	let required = (param) => {
		throw new Error(`${param} is required!`);
	}
    
	return {
		
		load: () => {
			
			/* Carregando os componentes */
			let oComponentes = $session.restaurant.componentes;				
			let eComponentes = document.querySelector("#componentes");
			let bLoaded =  $('#componentes > li').not('.header').length ? true : false;
				
			if (!bLoaded) {
				
				if(oComponentes) {
					oComponentes.forEach(function(componente) {

						let eLinha = document.createElement("li");
						let eLink = document.createElement("a");
						let eIcon = document.createElement("i");
						let eDescricao = document.createElement("span");

						if (componente.url == "#/home") {
							eLinha.className = "active";
						}

						eIcon.className = componente.icon;
						eDescricao.innerText = componente.name; 
						eLink.href = componente.url;
						eLink.appendChild(eIcon);
						eLink.appendChild(eDescricao);
						eLinha.appendChild(eLink);

						eComponentes.appendChild(eLinha);

					});
				}
				
			}			
        	
			/* Exibindo o layout */
			$('#main-header').removeClass("hidden").fadeIn("slow");
			$('#main-sidebar').removeClass("hidden").fadeIn("slow");
			$('#main-footer').removeClass("hidden").fadeIn("slow");
			$('body').addClass("fixed").fadeIn("slow");
			$('body').addClass("sidebar-mini");
			
			if (window.innerWidth >= 768) {
				
				$('.content-wrapper').css("margin-left", "230px");
				$('.content-wrapper').css("min-height", window.innerHeight - 51);
				
			} else if (window.innerWidth > 412 && window.innerWidth < 768) {

				$('.content-wrapper').css("min-height", window.innerHeight - 51);
				
			} else {
				$('.content-wrapper').css("min-height", window.innerHeight - 75);
			}
			
		},
		
		infoUserHeader: () => {
			
			/* Carregando dados usuário */
			let oDataUser = $session.restaurant.usuario;
			
			function fnType(nType) {
				
				switch (nType) {
					case 1: return "Administrador";
					case 2: return "Garçom";
					case 3: return "Cozinheiro";
					case 4: return "Caixa";
					case 5: return "Cliente";
					default: return "";
				}

			}

        	//Imagem e Nome no cabeçalho
        	let eNameUser = document.querySelector("#userNameHeader");
        		eNameUser.innerHTML = "";

        	let eImgHeader = document.createElement("img");
	        	eImgHeader.src = "static/assets/img/user.png";
	        	eImgHeader.className = "user-image";
	        	eImgHeader.alt = "Imagem usuário";

        	let eName = document.createElement("span");
	        	eName.className = "hidden-xs";
	        	eName.innerText = oDataUser.name;
        	
        	eNameUser.appendChild(eImgHeader);
        	eNameUser.appendChild(eName);
        	
        	//Imagem e Nome/Tipo no Dropdown do usuário
        	let eNameUserTypeDropdow = document.querySelector("#userNameTypeDropdown");
        		eNameUserTypeDropdow.innerHTML = "";

        	let eNameType = document.createElement("p");
        	let sType = fnType(oDataUser.rule);        	
        	eNameType.innerText = oDataUser.name + " - " + sType;

        	let eImgDropdown = document.createElement("img");
	        	eImgDropdown.src = "static/assets/img/user.png";
	        	eImgDropdown.className = "img-circle";
	        	eImgDropdown.alt = "Imagem usuário";

        	eNameUserTypeDropdow.appendChild(eImgDropdown);
        	eNameUserTypeDropdow.appendChild(eNameType);
		},
		
		alterMenuActive: () => {
			
			let bLoaded =  $('#componentes > li').not('.header').length ? true : false;
			
			if (!bLoaded) return false;
			
			let sHash = window.location.hash;
			let eComponentes = document.querySelector("#componentes");
			
			let eComponentAccess = eComponentes.querySelector("li a[href='"+sHash+"']");
			let eComponentActive = $("li[class='active']");
			
			if (sHash == "#/404") {
				
				eComponentActive[0].classList.remove('active');
				
			} else if (!eComponentActive[0]){
				
				eComponentAccess.parentElement.classList.add('active');

			} else {
				
				eComponentActive[0].classList.remove('active');
				eComponentAccess.parentElement.classList.add('active');

			}
			
		},
		
		dateTimeLocal: nMilliseconds => {
			
			let sDate;
			
			if(nMilliseconds){

				let oDate = new Date(nMilliseconds);
				let fDate = $filter('date')(oDate,'yyyy-MM-dd HH:mm:ss');
				
				sDate = new Date(fDate);

			}
			
			return sDate;
		},
				
		modal: function(o = required('Object parameter')) {
			
			this.instance = o.instance ? o.instance : '',
			this.view = o.view ? o.view : '',
			this.size = o.size ? o.size : '',
			this.bOpen = false,
			
			this.open = function(){
				
				this.instance = $modal.open({
					templateUrl: 'static/views/modals/' + o.template + '_modal.html',
					controller: o.controller,
					windowClass: 'app-modal-window-' + this.size,
					backdrop: 'static',
					scope: o.scope
			    });
				
				this.bOpen = true;				
				
			},
			
			this.close = function(){
				this.instance.close();
				this.bOpen = false;
			}
			
		},
		
		notifIt: {
			
			alert: (sType, sMsg, nTimeout = 5000, bMultiline = false) => {

				notif({
					msg: sMsg,
					type: sType,
					timeout: nTimeout,
					position: "center",
					fade: true,
					multiline: bMultiline
				});

			},
			
			remove: () => {
				$("#ui_notifIt").remove();
			}
			
		},
		
		ShowMenus: function() {

			$('#main-header').removeClass("hidden").fadeIn("slow");
			$('#main-sidebar').removeClass("hidden").fadeIn("slow");
			$('#main-footer').removeClass("hidden").fadeIn("slow");
			$('body').removeClass("sidebar-collapse").fadeIn("slow");
			$('body').addClass("fixed").fadeIn("slow");
			$('body').addClass("sidebar-mini");

			//this.createSkins();

			let nHeightWindow = window.innerHeight;
			$('.content-wrapper').css("min-height", nHeightWindow - 51);
			
		},
		
		dataTableDisplyLength: function(instance, step){
			
			if(instance.id){
				instance.DataTable.page.len(step).draw();
			}

			return instance;
			
		},

		dataTableSearch: function(instance, sSearch, nColumn) {

			if(instance.id){

        		//Preenchendo todos os dados para a busca
        		instance.DataTable.search('').columns().search('');

        		if(nColumn >= 0){
        			instance.DataTable.column(nColumn).search(sSearch).draw();
        		}else{
        			instance.DataTable.search(sSearch).draw();
        		}

        	}

        	return instance;

        },

        dataTableLoad: function(instance, data) {

        	if(instance.id){

        		instance.DataTable.clear().rows.add(data).draw();

        	}

        	return instance;

        },
        
        dataTableRowCallback: function(trigger, controls = false, selectable = true){

        	return	function(Node,Obj,Index) {

        		if(controls){

        			$('td > .btn-delete', Node).unbind('click');
        			$('td > .btn-delete', Node).bind('click', function() {

        				$(Node).addClass("delete");
        				$(document).trigger("dt."+trigger+".row.delete",Obj);

        			});

        			$('td > .btn-download', Node).unbind('click');
        			$('td > .btn-download', Node).bind('click', function() {

        				$(document).trigger("dt."+trigger+".row.download",Obj);

        			});

        			$('td > .btn-edit', Node).unbind('click');
        			$('td > .btn-edit', Node).bind('click', function() {

        				$(Node).addClass("edit");
        				$(document).trigger("dt."+trigger+".row.edit",Obj);

        			});

        			if(selectable){

        				$('td', Node).unbind('click');
        				$('td', Node).bind('click', function() {

        					$(Node).toggleClass('sel selected');

        					let count = $(Node).parent().find("tr.sel").length;

        					$(document).trigger("dt."+trigger+".row.click",count);

        				});

        			}


        		}else{

        			$(Node).unbind('click');
        			$(Node).bind('click', function() {

        				$(Node).parent().find("tr").not(Node).removeClass("sel selected")
        				$(Node).toggleClass('sel selected');

        				let count = $(Node).parent().find("tr.sel").length;
        				let param = "";

        				if(count){
        					param = Obj;
        				}

        				$(document).trigger("dt."+trigger+".row.click",param);

        			});

        			if(selectable){

        				$(Node).unbind('dblclick');
        				$(Node).bind('dblclick', function() {

        					$(Node).parent().find("tr").not(Node).removeClass("sel selected")
        					$(Node).addClass('sel selected');

        					$(document).trigger("dt."+trigger+".row.dblclick",Obj);

        				});

        			}

        		}

        		return Node;
        	}
        
        }
		
	}
	
}])