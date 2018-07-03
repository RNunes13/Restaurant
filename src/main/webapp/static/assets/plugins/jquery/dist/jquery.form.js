/* 
 * iForm | Plugin for jQuery.
 * Version 1.0
 * Author Lucas Marin Marques.
 */

(function($) {

	$.fn.iForm = function(Options) {

		var Default = $.extend({
			Submit : function(Json) {

			},
			Error : function(Input, Msg) {

			},
			Invalid : function(Input) {

			},
			Valid : function(Input) {

			},
			Class : {
				Invalid : "invalid",
				Empty : "empty"
			}
		}, Options);

		this.attr("novalidate", "novalidate");

		this.on("submit", function(e) {

			e.preventDefault();

			var Valid = CheckValid(this);

			if (Valid) {
				
				var Array = $(this).serializeArray();
				var Json = {};
				
				
				Array.forEach(function(obj) {
					Json[obj.name] = obj.value;
				});

				Default.Submit.call(undefined, Json);
				
			}

		});

		this.on("reset", function() {

			ResetFeedback();

		});

		this.find(":required").addClass(Default.Class.Empty).on("keydown", function() {

			if (this.value.length > 0) {
				$(this).removeClass(Default.Class.Empty);
			} else {
				$(this).addClass(Default.Class.Empty);
			}

		});
		
		this.find("[type='moment']").maskMoney({sufix:' horas', thousands:'',decimal:'.',precision:2,affixesStay: false});
		
		this.find("[type='float']").maskMoney({prefix:'', thousands:'',decimal:'.'});
		
		this.find("[type='moneyus']").maskMoney({prefix:'', thousands:',',decimal:'.',affixesStay: false});
		this.find("[type='moneyus4']").maskMoney({prefix:'', thousands:',',decimal:'.',affixesStay: false, precision: 4});
		
		this.find("[type='moneyrs']").maskMoney({prefix:'', thousands:'.',decimal:',',affixesStay: false});
		this.find("[type='moneyrs4']").maskMoney({prefix:'', thousands:'.',decimal:',',affixesStay: false, precision: 4});

		this.find("[type='int']").on("keyup", function() {

			var Status = is_number(this.value);

			ShowFeedback(this, Status);

		}).on("keypress",function(event) {
			return event.charCode >= 48 && event.charCode <= 57	|| event.charCode == 13;
		});
		

		this.find("[type='alpha']").on("keyup", function() {

			var Status = is_alpha(this.value);

			ShowFeedback(this, Status);

		}).on("keypress",function(event) {
			return event.charCode < 48 || event.charCode > 57 || event.charCode == 13;
		});

		this.find("[type='login']").on("keyup", function() {

			var Status = is_char(this.value);

			ShowFeedback(this, Status);

		}).on("keypress", function(event) {
			return event.charCode < 48 || event.charCode > 57;
		});

		this.find("[type='char']").on("keyup", function() {

			var Status = is_char(this.value);

			ShowFeedback(this, Status);

		});

		this.find("[type='cnpj']").on("keyup", function() {

			var Status = is_cnpj(this.value);

			ShowFeedback(this, true);

		}).mask("00.000.000/0000-00", {
	        clearIfNotMatch: false	        
	    });

		this.find("[type='cpf']").on("keyup", function() {

			var Status = is_cpf(this.value);

			ShowFeedback(this, true);

		}).mask("000.000.000-00", {
	        clearIfNotMatch: false	        
	    });
		
		this.find("[type='cep']").on("change blur focus", function() {
			
			var Status = is_cep(this.value);
			
			ShowFeedback(this, Status);

		}).mask("00.000-000", {
	        clearIfNotMatch: false	        
	    });
		
		var SPMaskBehavior = function (val) {
	        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
	    };

	    var spOptions = {
	        clearIfNotMatch: true,
	        onKeyPress: function (val, e, field, options) {
	            field.mask(SPMaskBehavior.apply({}, arguments), options);
	        }	        
	    };

		this.find("[type='tel']").on("keyup", function() {

			var Status = is_tel(this.value);

			ShowFeedback(this, Status);

		}).mask(SPMaskBehavior, spOptions);
		
		this.find("[type='cel']").on("keyup", function() {

			var Status = is_cel(this.value);

			ShowFeedback(this, Status);

		}).mask(SPMaskBehavior, spOptions);

		this.find("[type='email']").on("keyup change", function() {

			var Status = is_email(this.value);

			ShowFeedback(this, Status);

		});

		function CheckValid(Form) {

			var Form = $(Form);
			var Data = Form.serializeArray();
			var Len = 0;

			while (Len < Data.length) {

				var Input = Form.find("[name='" + Data[Len].name + "']");

				if (Input.prop("required")) {

					if (Data[Len].value.length === 0) {
						Default.Error.call(undefined, Input,
								"Campo obrigatório. ");
						Input.focus();
						return false;
						break;
					}

				}
				
				if (Input.hasClass(Default.Class.Invalid)) {

					Default.Error.call(undefined, Input, "Campo inválido. ");
					Input.focus();
					return false;
					break;

				}
				
				if (Input.attr("minlength")) {

					var Length = Input.attr("minlength");

					if (Data[Len].value.length < Length) {
						Default.Error.call(undefined, Input, "Mínimo " + Length
								+ " Caractéres. ");
						Input.focus();
						return false;
						break;
					}

				}
				
				

				Len++;

			}

			return true;

		}

		


		function is_email(Text) {

			var er = /^[a-zA-Z0-9][a-zA-Z0-9\._-]+@([a-zA-Z0-9\._-]+\.)[a-zA-Z-0-9]{2,3}/;
			

			if (!er.exec(Text)) {
				return false;
			} else {
				return true;
			}
		}

		function is_alpha(Text) {

			var er = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;

			if (!er.exec(Text)) {
				return false;
			} else {
				return true;
			}

		}

		function is_number(Text) {

			var er = /^[0-9 ]+$/;

			if (!er.exec(Text)) {
				return false;
			} else {
				return true;
			}

		}

		function is_cel(Text) {
		
			var er = /^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$/;

			if (er.exec(Text)) {
				return true;
			} else {
				return false;
			}

		}
		
		function is_tel(Text) {
			
			var er = /^\(?\d{2}\)?[\s-]?[\s9]?[\s8]?[\s7]?[\s6]?[\s5]?[\s4]?[\s3]?[\s2]?[\s1]?\d{4}-?\d{4}$/;

			if (er.exec(Text)) {
				return true;
			} else {
				return false;
			}

		}

		function is_char(Text) {

			var er = /^[A-Za-z0-9 ]+$/;

			if (!er.exec(Text)) {
				return false;
			} else {
				return true;
			}

		}
		
		function is_cep(Text) {

			var er = /^\d{2}.?\d{3}-?\d{3}$/;

			if (!er.exec(Text)) {
				return false;
			} else {
				return true;
			}
		
		}

		function is_cnpj(Text) {

			var er = /^\d{2}.?\d{3}.?\d{3}\/?\d{4}-?\d{2}$/;

			if (!er.exec(Text)) {
				return false;
			}

			Text = Text.replace(/[^\d]+/g, '');

			if (Text === "00000000000000" || Text === "11111111111111"
					|| Text === "22222222222222" || Text === "33333333333333"
					|| Text === "44444444444444" || Text === "55555555555555"
					|| Text === "66666666666666" || Text === "77777777777777"
					|| Text === "88888888888888" || Text === "99999999999999") {
				return false;
			}

			function calc(cnpj, j, len) {
				var Soma = 0;
				for (var i = 0; i < len; i++) {
					Soma += cnpj.substr(i, 1) * j;
					if (parseInt(j) === 2) {
						j = 9;
					} else {
						j--;
					}
				}
				return Soma % 11;
			}

			var Resto = [];

			Resto[1] = calc(Text, 5, 12);

			if (parseInt(Text.substr(12, 1)) !== parseInt(Resto[1] < 2 ? 0
					: 11 - Resto[1])) {
				return false;
			}

			Resto[2] = calc(Text, 6, 13);

			return parseInt(Text.substr(13, 1)) === parseInt(Resto[2] < 2 ? 0
					: 11 - Resto[2]);

			return true;

		}

		function is_cpf(Text) {

			var er = /^\d{3}.?\d{3}.?\d{3}-?\d{2}$/;

			if (!er.exec(Text)) {
				return false;
			}

			Text = Text.replace(/[^\d]+/g, '');

			var $sum = 0;
			var $cpf = Text.split("");
			var $cpftrueverifier = [];
			var $cpfnumbers = $cpf.splice(0, 9);
			$cpfnumbers = $cpfnumbers.map(Number);
			$cpf = $cpf.map(Number);
			var $cpfdefault = [ 10, 9, 8, 7, 6, 5, 4, 3, 2 ];

			for (var $i = 0; $i <= 8; $i++) {
				$sum += $cpfnumbers[$i] * $cpfdefault[$i];
			}

			var $sumresult = $sum % 11;

			if ($sumresult < 2) {
				$cpftrueverifier[0] = 0;
			} else {
				$cpftrueverifier[0] = 11 - $sumresult;
			}

			$sum = 0;
			$cpfdefault = [ 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];
			$cpfnumbers[9] = $cpftrueverifier[0];

			for ($i = 0; $i <= 9; $i++) {
				$sum += $cpfnumbers[$i] * $cpfdefault[$i];
			}

			$sumresult = $sum % 11;

			if ($sumresult < 2) {
				$cpftrueverifier[1] = 0;
			} else {
				$cpftrueverifier[1] = 11 - $sumresult;
			}

			var $returner = false;

			if ($cpf.toString() === $cpftrueverifier.toString()) {
				$returner = true;
			}

			var $cpfver = $cpfnumbers.concat($cpf);

			var Array = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ];

			var Unique = [];

			$.each($cpfver, function(i, el) {
				if ($.inArray(el, Unique) === -1) {
					Unique.push(el);
				}
			});

			var Len = parseInt(Unique.length);

			if (Len === 1 || $cpfver === Array) {
				$returner = false;
			}

			return $returner;

		}

		function ShowFeedback(This, Status) {

			var Input = $(This);
			
			if (This.value.length === 0) {
				Status = !Input.prop("required");
			}

			if (This.minLength > This.value.length) {
				Status = false;
			}

			if (Status) {
				Input.removeClass(Default.Class.Invalid);
				Default.Valid.call(undefined, Input);
			} else {
				Input.addClass(Default.Class.Invalid);
				Default.Invalid.call(undefined, Input);
			}

		}

		function ResetFeedback() {

			$(this).find('input,select,textarea').removeClass(
					Default.Class.Invalid);

		}

	};

})(jQuery);