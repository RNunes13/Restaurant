'use strict';

$(document).ready(function() {
	
	$('body').removeClass("hidden").delay("1000").fadeIn("slow");

	/*fnCreateSkins();*/
	
});

/*function fnCreateSkins(){

	let eSettings = document.querySelector("#control-sidebar-settings-tab");
	let aColors = ['blue', 'black', 'purple', 'green', 'red', 'yellow'];
	let eList = document.createElement("ul");
	eList.classList.add("list-unstyled", "clearfix");

	aColors.forEach(function(color) {

		let eItem = document.createElement("li");
		eItem.classList.add("text-skins");

		let eColor = document.createElement("div");
		eColor.classList.add("color-skin", "color-" + color);
		eColor.addEventListener('click', function(){
			fnChangeSkin(color);
		});

		let eText = document.createElement("p");
		eText.classList.add("text-center", "no-margin");
		eText.innerText = color[0].toUpperCase() + color.substring(1);

		eItem.appendChild(eColor);
		eItem.appendChild(eText);
		eList.appendChild(eItem);
		eSettings.appendChild(eList);

	});

};*/

/*function fnChangeSkin(color){

	let oSkin = {
		'sColor': color
	};

	let eBody = document.querySelector("body");
	let aClass = eBody.className.split(' ');

	//Remove current skin
	aClass.forEach(function(sClass) {
		let bSkin = sClass.substring(0, 4) === "skin";
		if (bSkin) {
			eBody.classList.remove(sClass);
		}			
	});

	//Add selected skin
	eBody.classList.add("skin-" + oSkin.sColor);

	localStorage.setItem("skin", JSON.stringify(oSkin));

};*/
