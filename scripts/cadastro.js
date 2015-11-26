var login = new Array();

$("#cadastro").on("pageshow", function() 
{
	if (sessionStorage.login_status == 1)
	{
		login = $.makeArray(JSON.parse(sessionStorage.cliente));
		
		$("#nome").val(login[0].nome);
		$("#email").val(login[0].email);
		$("#senha").val(Base64.decode(login[0].senha));
		$("#csenha").val($("#senha").val());
		ddd = login[0].telefone.split(")"); 
		telefone = ddd[1];
		ddd = ddd[0].split("(");
		$("#ddd").val(ddd[1]);
		$("#telefone").val(telefone);
	}
});

function cadastro_visitante(dados_endereco, callback)
{
	var cliente = {};

	cliente["nome"] = "@99visitante99@";
	cliente["email"] = "";
	cliente["senha"] = "";
	cliente["telefone"] = "";
	cliente["ativo"] = "1";
	dados_cliente = JSON.stringify(cliente);
	
	$.ajax(
	{
		type: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: "true",
		url: sessionStorage.server+"/wolke/wolke.php?JOB=login&MTD=cadastrar_cliente",
		data: 'dados='+dados_cliente,
		success: function(msg) 
		{
		    jsonArray = $.makeArray(msg);
		},
		complete: function()
		{
			if (typeof callback === "function")
			{ 
				callback(jsonArray[0], "", dados_endereco, cadastro_endereco);
			}
		},
		error: function(msg) 
		{ popup_ok("CADASTRO: Erro na pesquisa de dados"); }
	});
}

function cadastro_cliente(dados)
{
	var id_cliente;
	
	$.ajax(
	{
		type: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: "true",
		url: sessionStorage.server+"/wolke/wolke.php?JOB=login&MTD=cadastrar_cliente",
		data: 'dados='+dados,
		success: function(msg) 
		{
		    jsonArray = $.makeArray(msg);
	    	if (jsonArray.length > 0)
	    	{
	    		if (jsonArray != 0)
		    	{
	    			if (jsonArray == 1)
	    			{ popup_ok("CADASTRO: "+jsonArray); }
		    	} else
    			{ popup_ok("CADASTRO: Erro no cadastro do cliente"); }
			}	 
		},
		complete: function()
		{
		},
		error: function(msg) 
		{ popup_ok("CADASTRO: Erro na pesquisa de dados"); }
	});
}

function atualizar_cliente(cliente, dados)
{
	$.ajax(
	{
		type: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: "true",
		url: sessionStorage.server+"/wolke/wolke.php?JOB=login&MTD=atualizar_cliente",
		data: 'cliente='+cliente+'&dados='+dados,
		success: function(msg) 
		{
		    jsonArray = $.makeArray(msg);
		},
		complete: function()
		{
	    	if (jsonArray.length > 0)
	    	{
	    		if (jsonArray != 0)
		    	{
	    			if (jsonArray == 1)
	    			{ 
	    				vaipara = sessionStorage.login_status;

	    				login = $.makeArray(JSON.parse(dados));
	    				email = login[0].email;
	    				senha = login[0].senha;
	    				autentica(email, senha, vaipara, segue_cadastro);
	    			}
		    	} else
    			{ popup_ok("CADASTRO: Erro na atualização do cliente"); }
			}	 
		},
		error: function(msg) 
		{ popup_ok("CADASTRO: Erro na pesquisa de dados"); }
	});
}

function segue_cadastro(vaipara)
{
	popup_ok("CADASTRO: Cliente Atualizado"); 
	
	if (vaipara == 9)
	{ $(window.document.location).attr('href','concluir.html'); } else
	{ $(window.document.location).attr('href','produtos.html'); }
}

$("#cadastro").on("click", "#bt_acesso", function()
{	
	$(window.document.location).attr('href','acesso.html');
}); 

$("#cadastro").on("click", "#bt_atualizar", function()
{	
	if (valida_cadastro())
	{
		idcliente = $.makeArray(JSON.parse(sessionStorage.cliente));
		
		var cliente = {};
		var senha = Base64.encode($("#senha").val());
		
		cliente["nome"] = $("#nome").val();
		cliente["email"] = $("#email").val();
		cliente["senha"] = senha;
		cliente["telefone"] = '('+$("#ddd").val()+')'+$("#telefone").val();
		cliente["ativo"] = "1";
		
		dados_cliente = JSON.stringify(cliente);
		atualizar_cliente(idcliente[0].idcliente, dados_cliente);
	}
}); 

function valida_cadastro()
{
	erro = 1;
	if ($("#nome").val() == '')
	{ popup_ok("CADASTRO: Preencha o campo NOME"); erro = 0; } else
	{
		if ($("#email").val() == '')
		{ popup_ok("CADASTRO: Preencha o campo EMAIL"); erro = 0; } else
		{
			if ($("#senha").val() == '')
			{ popup_ok("CADASTRO: Preencha o campo SENHA"); erro = 0; } else
			{
				if ($("#csenha").val() == '')
				{ popup_ok("CADASTRO: Preencha o campo CONFIRME A SENHA"); erro = 0; } else
				{
					if ($("#ddd").val() == '')
					{ popup_ok("CADASTRO: Preencha o campo DDD"); erro = 0; } else
					{
						if ($("#telefone").val() == '')
						{ popup_ok("CADASTRO: Preencha o campo TELEFONE"); erro = 0; } else
						{
							if ($("#senha").val() != $("#csenha").val())
							{ popup_ok("CADASTRO: Confirmação de SENHA não confere"); erro = 0; } 
						}
					}
				}
			}
		}
	}
	
	return erro;
}

