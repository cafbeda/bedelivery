$("#login").on("pageinit", function() 
{
	if ($("#email").val() == '')
	{
		$("#email").val(localStorage.login);
		$("#senha").val(localStorage.senha);
	}
	
	$("#lembrar_login").val("1");
	$('#lembrar_login option[value="1"]').attr({ selected : "selected" });	
});

$("#login").on("change", "#lembrar_login", function()
{
	localStorage.lembrar = $("#lembrar_login").val();
});

$("#login").on("click", "#bt_entrar", function()
{
	if (valida_login())
	{
		localStorage.login = $("#email").val();
		localStorage.senha = $("#senha").val();

		var senha = Base64.encode($("#senha").val());
		autentica($("#email").val(), senha, null, null);
	}
}); 
	
$("#login").on("click", "#bt_esqueci", function()
{	
	$("#senha").hide();
	$("#bt_esqueci").hide();
	$("#bt_face").hide();
	$("#bt_entrar").html('Enviar Senha');
}); 

function autentica(email, senha, dados_endereco, callback)
{
	var jsonArray = new Array();

	$.ajax(
	{
		type: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: "true",
		url: sessionStorage.server+"/wolke/wolke.php?JOB=login&MTD=autentica",
		data: 'email='+email+'&senha='+senha,
		success: function(msg) 
		{
		    jsonArray = $.makeArray(msg);
			if (jsonArray < 0)
		    {
		   		if (jsonArray == -1)
		   		{ popup_ok("LOGIN: Usuário não cadastrado"); }
		   		if (jsonArray == -2)
		   		{ popup_ok("LOGIN: Senha inválida"); }
		    } else
		    { 
				sessionStorage.cliente = JSON.stringify(jsonArray);
		    }
		},
		complete: function()
		{
			if ((jsonArray != -1) && (jsonArray != -2))
			{
		    	if (senha != "")
		    	{ 
					nome_sobrenome(jsonArray[0].nome);
					sessionStorage.login_status = 1;

					if (parseInt(dados_endereco) > 0)
					{ callback(dados_endereco); } else
					{ seleciona_favorito(jsonArray[0].idcliente, abre_produtos); } 
		    	} else
		    	{
		    		login = $.makeArray(JSON.parse(sessionStorage.cliente));
					dados_endereco["idcliente"] = login[0].idcliente;
					dados_endereco = JSON.stringify(dados_endereco);
		
					if (typeof callback === "function")
					{ 
						callback(dados_endereco, seleciona_favorito);
					}
					sessionStorage.login_status = 9;
					sessionStorage.nome_cliente = login[0].nome;
				}
			}
		},
		error: function(msg) 
		{ popup_ok("LOGIN: Erro na pesquisa de dados"); }
	});
}

function nome_sobrenome(nomes)
{
	$.ajax(
	{
		type: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: "true",
		url: sessionStorage.server+"/wolke/wolke.php?JOB=login&MTD=nome_sobrenome",
		data: 'nomes='+nomes,
		success: function(msg) 
		{
		    jsonArray = $.makeArray(msg);
			sessionStorage.nome_cliente = jsonArray;
		},
		complete: function()
		{
		},
		error: function(msg) 
		{ popup_ok("LOGIN: Erro na conversão de nome/sobrenome"); }
	});
}

$("#login").on("click", "#bt_acesso", function()
{	
	$(window.document.location).attr('href','acesso.html');
}); 

function valida_login()
{
	erro = 1;
	if ($("#email").val() == '')
	{ popup_ok("LOGIN: Preencha o campo EMAIL"); erro = 0; } else
	{
		if ($("#senha").is(':visible'))
		{ 
			if ($("#senha").val() == '')
			{ popup_ok("LOGIN: Preencha o campo SENHA"); erro = 0; }
		}
	}
	
	return erro;
}

