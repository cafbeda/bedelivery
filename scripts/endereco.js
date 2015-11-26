$("#endereco").on("pageinit", function() 
{
	var jsonArray = new Array();
	
	$.ajax(
	{
		type: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		assync: true,
		url:    sessionStorage.server+"/wolke/wolke.php?JOB=enderecos&MTD=uf",
		success: function(msg) 
		{
			var html = '<option value="0">Selecione UF</option>';

		    jsonArray = $.makeArray(msg);
	    	if (jsonArray.length > 0)
	    	{
			    for(i=0; i < jsonArray.length; i++)
			    { html += '<option value="'+jsonArray[i].codigo_uf+'">'+jsonArray[i].sigla_uf+'</option>'; }
			} 
			
	    	$("#lista_uf").html(html);
	    	$("#lista_uf").selectmenu('refresh'); 
		},
		complete: function()
		{
		},
		error: function(msg) 
		{ popup_ok("UF: Erro na pesquisa de dados"); }
	}); 

	if (sessionStorage.gps != '')
	{
		gps = $.makeArray(JSON.parse(sessionStorage.gps));
	
		$("#cep").val(gps[0].cep);
		$("#end").val(gps[0].endereco);
		$("#bairro").val(gps[0].bairro);
		$("#lista_uf").val(gps[0].uf);
		$("#lista_mun").val(gps[0].municipio);
		lista_mun(gps[0].uf, gps[0].municipio);
	} else
	{
		lista_mun($("#lista_uf").val("0"), "0");
	}

}); 

$("#lista_uf").on("change", function()
{ lista_mun($("#lista_uf").val(), "0"); });

$("#endereco").on("mouseout", "#cep", function()
{ 
	if ($("#cep").val().length == 8)
	{ cep4end($("#cep").val()); }
}); 

$("#cep").keyup(function()
{ 
	if ($("#cep").val().length == 8)
	{
		$("#lista_uf").attr("disabled", true);
		$("#lista_mun").attr("disabled", true);
	} else
	{
		$("#lista_uf").attr("enabled", true);
		$("#lista_mun").attr("enabled", true);
	}
});

$("#endereco").on("click", "#bt_consend", function()
{ 
	if ($("#cep").val().length == 8)
	{ cep4end($("#cep").val()); } else
	{
		//
	}
}); 

$("#endereco").on("click", "#bt_confend", function()
{ 
	if (valida_endereco())
	{
		var dados = {};
	
		dados["nome"] =  "";
		dados["codigo_municipio"] = $("#lista_mun").val();
		dados["endereco"] = $("#end").val();
		dados["bairro"] = $("#bairro").val();
		dados["numero"] = $("#numero").val();
		dados["cep"] =  "";
		dados["complemento"] = $("#comp").val();
		dados["preferencial"] = "1";
		dados["referencia"] = "";
			
		cadastro_visitante(dados, autentica);
	}
}); 

function cep4end(cep)
{
	if (cep != "")
	{
		var jsonArray = new Array();

		$.ajax(
		{
			type: "GET",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			async: "true",
			url: sessionStorage.server+"/wolke/wolke.php?JOB=enderecos&MTD=cep4end",
			data: 'cep='+cep,
			success: function(msg) 
			{
			    jsonArray = $.makeArray(msg);
		    	if (jsonArray.length > 0)
		    	{
		    		if (jsonArray[0].erro > 100)
			    	{
		    			if (jsonArray[0].erro ==  104)
		    			{ popup_ok("ENDEREÇO: O CEP informado não pertence a regiões atendidas pelo BeDelivery"); } else
		    			{ popup_ok("ENDEREÇO: O CEP informado não foi localizado ou não existe"); }
			    	} else
			    	{ 
			    		$("#end").val(jsonArray[0].endereco);
			    		$("#bairro").val(jsonArray[0].bairro);
			    		$("#lista_uf").val(jsonArray[0].uf);
			    		lista_mun(jsonArray[0].uf, jsonArray[0].municipio);
			    	}
				}	 
			},
			complete: function()
			{
			},
			error: function(msg) 
			{ popup_ok("ENDEREÇO: Erro na pesquisa de dados"); }
		});
	}
}

function lista_mun(cod_uf, cod_mun)
{
	$.ajax(
	{
		type: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		assync: true,
		url:    sessionStorage.server+"/wolke/wolke.php?JOB=enderecos&MTD=municipio",
		data: 'uf='+cod_uf,
		success: function(msg) 
		{
			var html = '<option value="0" selected>Selecione Município</option>';

		    jsonArray = $.makeArray(msg);
	    	if (jsonArray.length > 0)
	    	{
			    for(i=0; i < jsonArray.length; i++)
			    { html += '<option value="'+jsonArray[i].codigo_municipio+'">'+jsonArray[i].descricao+'</option>'; }
			} 
			
	    	$("#lista_mun").html(html);
	    	
	    	if (cod_uf != "0")
    		{ $("#lista_uf").val(cod_uf); }
	    	
    		$("#lista_mun").val(cod_mun);
	    	$("#lista_mun").selectmenu('refresh'); 
		},
		complete: function()
		{
		},
		error: function(msg) 
		{ popup_ok("MUN: Erro na pesquisa de dados"); }
	}); 
}

function cadastro_endereco(dados, callback)
{
	$.ajax(
	{
		type: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: "true",
		url: sessionStorage.server+"/wolke/wolke.php?JOB=enderecos&MTD=cadastrar_endereco",
		data: 'dados='+dados,
		success: function(msg) 
		{
		    jsonArray = $.makeArray(msg);
	    	if (jsonArray.length > 0)
	    	{
	    		if (jsonArray[0] == 1)
		    	{
	    			popup_ok("ENDEREÇO: Endereço Cadastrado");
		    	} else
    			{ popup_ok("ENDEREÇO: Erro no cadastro de endereço"); }
			}	 
		},
		complete: function()
		{
			if (typeof callback === "function")
			{ 
				login = $.makeArray(JSON.parse(dados));
				callback(login[0].idcliente, abre_produtos);
			}
		},
		error: function(msg) 
		{ popup_ok("ENDEREÇO: Erro na pesquisa de dados"); }
	});
}

function seleciona_endereco(endereco, callback)
{
	$.ajax(
	{
		type: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: "true",
		url: sessionStorage.server+"/wolke/wolke.php?JOB=enderecos&MTD=seleciona_endereco",
		data: 'cod_endereco='+endereco,
		success: function(msg) 
		{
		    jsonArray = $.makeArray(msg);
	    	if (jsonArray.length > 0)
	    	{
				sessionStorage.endereco = JSON.stringify(jsonArray);
			}	 
		},
		complete: function()
		{
			 if (typeof callback === "function")
			 { callback(); }
		},
		error: function(msg) 
		{ popup_ok("ENDEREÇO: Erro na pesquisa de dados"); }
	});
}

function seleciona_favorito(cliente, callback)
{
	$.ajax(
	{
		type: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: "true",
		url: sessionStorage.server+"/wolke/wolke.php?JOB=enderecos&MTD=seleciona_favorito",
		data: 'cliente='+cliente,
		success: function(msg) 
		{
		    jsonArray = $.makeArray(msg);
	    	if (jsonArray.length > 0)
	    	{
			}	 
		},
		complete: function()
		{
			sessionStorage.endereco = JSON.stringify(jsonArray);
			if (typeof callback === "function")
			{ callback(); }
		},
		error: function(msg) 
		{ popup_ok("ENDEREÇO: Erro na pesquisa de dados"); }
	});
}

function abre_produtos()
{
	$(window.document.location).attr('href','produtos.html');
}

$("#endereco").on("click", "#bt_acesso", function()
{	
	$(window.document.location).attr('href','acesso.html');
}); 

function valida_endereco()
{
	erro = 1;
	if ($("#cep").val() == '')
	{ popup_ok("ENDEREÇO: Preencha o campo CEP ou clique em [Obter o CEP]"); erro = 0; } else
	{
		if ($("#lista_uf").val() == '')
		{ popup_ok("ENDEREÇO: Preencha o campo UF"); erro = 0; } else
		{
			if ($("#lista_mun").val() == '')
			{ popup_ok("ENDEREÇO: Preencha o campo Município"); erro = 0; } else
			{
				if ($("#end").val() == '')
				{ popup_ok("ENDEREÇO: Preencha o campo ENDEREÇO"); erro = 0; } else
				{
					if ($("#bairro").val() == '')
					{ popup_ok("ENDEREÇO: Preencha o campo BAIRRO"); erro = 0; } else
					{
						if ($("#numero").val() == '')
						{ popup_ok("ENDEREÇO: Preencha o campo NÚMERO"); erro = 0; }
					}
				}
			}
		}
	}
	
	return erro;
}



