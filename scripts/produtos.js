var jsonArray = new Array();

$("#produtos").on("pageshow", function() 
{
	if (sessionStorage.ordem == '')
	{ sessionStorage.ordem = 'DESA'; }
	$("#"+sessionStorage.ordem).prop('checked', true);

	if (sessionStorage.idempresa != '')
	{ 
		painel_loja(); 
		
		if (sessionStorage.ordem == 'LOJA' || sessionStorage.ordem == 'LOJD')
		{ 
			sessionStorage.ordem = 'DESA'; 
			$("#"+sessionStorage.ordem).prop('checked', true);
		}

		if (sessionStorage.loja != '' && sessionStorage.idreset == 1)
		{ $("#bt_carrinho").show(); } else
		{ $("#bt_carrinho").hide(); }
	} else
	{ 
		$("#bt_carrinho").hide();
	}
	
	if (sessionStorage.texto_pesquisa != '')
	{
		$("#pesquisa").val(sessionStorage.texto_pesquisa);
		pesquisa_produtos();
	} else
	{ 
		$("#p_filtro").hide();
		pesquisa_segmentos();
	}
});

$("#produtos").on("pageinit", function() 
{
	$("#produtos").on("click", "#bt_produto", function()
	{
    	sessionStorage.texto_pesquisa = $("#pesquisa").val();
    	sessionStorage.filtros = '';
		pesquisa_produtos();
	});
				
	$("#produtos").on("click", "#bt_carrinho", function()
	{ $(window.document.location).attr('href','carrinho.html'); });
				
	$("#produtos").on("click", "#bt_limpar", function()
	{ 
	   	$.mobile.loading('show');
		$("#pesquisa").val(''); 
		$("#p_filtro").hide();
    	sessionStorage.texto_pesquisa = '';
    	sessionStorage.filtros = '';
		$("#lista_produtos").empty();
		$("#p_filtro").hide();
	   	$.mobile.loading('hide');
		pesquisa_segmentos();
	});
	
	$("#produtos").on("click", "#bt_reset", function()
	{ 
		sessionStorage.idreset = 1; 
		sessionStorage.idempresa = '';
		sessionStorage.loja = '';
		location.reload(false);
	});
				
	$('#lista_produtos').delegate('li', 'click', function() 
    {
		var item = parseInt($(this).attr('id'));
		var produto = JSON.stringify(jsonArray[item]);
		sessionStorage.item_detalhe = produto;
    });	
	
	$('#lista_segmentos').delegate('li', 'click', function() 
	{
		sessionStorage.idreset = 2;
		var item = parseInt($(this).attr('id'));
		var empresa = jsonArray[item].idempresa;
		sessionStorage.idempresa = empresa;
		endereco = $.makeArray(JSON.parse(sessionStorage.endereco));
		seleciona_loja(sessionStorage.idempresa, endereco[0].idenderecos, formas_pagto, 1);
	});	
	
	$('#filtro').delegate('input:radio[name="f_ordenar"]', 'change', function() 
    {
		sessionStorage.ordem = $("input:radio[name='f_ordenar']:checked").val();
		pesquisa_produtos();
    });	
});

function pesquisa_produtos()
{
	if ($("#pesquisa").val().length > 3)
	{
		sessionStorage.detalhe = 1;
		pesquisa = $("#pesquisa").val();
		endereco = $.makeArray(JSON.parse(sessionStorage.endereco));
					
		$.mobile.loading('show');
			    	
    	$.ajax(
		{
			type: "GET",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			async: "true",
			changeHash: false,
		    url:  sessionStorage.server+"/wolke/wolke.php?JOB=produtos&MTD=produtos",
		    data: 'loja='+sessionStorage.idempresa+'&endereco='+endereco[0].idenderecos+
		    '&grupo=1&ordem='+sessionStorage.ordem+'&pesquisa='+pesquisa+'&filtros='+sessionStorage.filtros+'&app=true',
		    success: function(msg) 
		    {
		    	jsonArray = $.makeArray(msg);
		    },
		    complete: function()
		    {
				if (jsonArray.length > 0)
				{
					$("#lista_segmentos").empty();
					$("#p_filtro").show();
			    	lista_produtos();
				} else
				{ 
					$("#p_filtro").hide();
			    	sessionStorage.texto_pesquisa = '';
					popup_ok("Produto não Encontrado"); 
				}
					    	
		    	$.mobile.loading('hide');
		    },
		    error: function(msg) 
		    { popup_ok("PRODUTOS: Erro na pesquisa de dados"); }
		});
	} else
	{ 
    	sessionStorage.texto_pesquisa = $("#pesquisa").val();
		popup_ok("Informe o Nome do Produto ou Fabricante"); 
	}
}

function lista_produtos()
{
	imagem = sessionStorage.server+"/produtos/";
	var html = ''; s_s = ' ';
	
	if (jsonArray.length > 1)
	{ s_s = 's '; }

	if (jsonArray.length > 0)
	{
		html += '<li data-role="list-divider" data-theme="p">'+(jsonArray.length).toString()+' produto'+s_s+'encontrado'+s_s+'</li>';
	  	for(i=0; i < jsonArray.length; i++)
	   	{
			html += 
			'<li id="'+(i).toString()+'" data-id="'+jsonArray[i].codebar+'">'+
				'<a href="#">'+
					'<div class="figura_itens"><img class="img_itens" src="'+imagem+jsonArray[i].imagem+'" /></div>'+
					'<div class="itens">'+
						'<div class="produto">'+jsonArray[i].descricao+'</div>'+
						'<div class="dados_itens">'+jsonArray[i].complemento+'</div>'+
						'<div class="dados_itens">'+jsonArray[i].apresentacao+'</div>'+
						'<div class="fornecedor_itens">'+jsonArray[i].fornecedor+'</div><br/>';

						if (sessionStorage.idempresa == '')
						{ 
							html += '<div class="loja_itens">'+jsonArray[i].nome_fantasia+'</div>';
						}
			
						html += 
						'<div class="preco_promo">De R$ '+parseFloat(jsonArray[i].preco_venda).toFixed(2)+'</div>'+
						'<div class="preco_itens">Por R$ '+parseFloat(jsonArray[i].preco_promo).toFixed(2)+'</div>'+
					'</div>'+
				'</a>'+
				'<a href="detalhe.html" class="addcart" id="bt_addcart"></a>'+
			'</li>';
		}
				
	   	$("#lista_produtos").html(html);
	   	$("#lista_produtos").listview('refresh'); 

	   	carrega_filtros();
 	}
}				
			
// -------- SEGMENTOS -------------------------

function pesquisa_segmentos()
{
	sessionStorage.detalhe = 1;
	endereco = $.makeArray(JSON.parse(sessionStorage.endereco));
					
   	$.mobile.loading('show');
			    	
   	$.ajax(
	{
		type: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: "true",
		changeHash: false,
	    url:  sessionStorage.server+"/wolke/wolke.php?JOB=filtro&MTD=filtro_segmentos",
	    data: 'endereco='+endereco[0].idenderecos,
	    success: function(msg) 
	    {
	    	jsonArray = $.makeArray(msg);
	    },
	    complete: function()
	    {
			if (jsonArray.length > 0)
			{
				//$("#p_filtro").show();
		    	lista_segmentos();
			} else
			{ 
				$("#p_filtro").hide();
				// Nenhuma loja aberta !
			}
					    	
	    	$.mobile.loading('hide');
	    },
	    error: function(msg) 
	    { popup_ok("SEGMENTOS: Erro na pesquisa de dados"); }
	});
}

function lista_segmentos()
{
	imagem = sessionStorage.server+"/logos/empresas/";
	var html = ''; s_s = ' '; segmento = '';
	
	if (jsonArray.length > 1)
	{ s_s = 's '; }

	if (jsonArray.length > 0)
	{
		html += '<li data-role="list-divider" data-theme="p">'+(jsonArray.length).toString()+' Loja'+s_s+'aberta'+s_s+'próximo a você</li>';
		
	  	for(i=0; i < jsonArray.length; i++)
	   	{
			if (segmento != jsonArray[i].idsegmento)
			{
				html += '<li data-role="list-divider" class="lvd_segmentos" data-theme="p">'+jsonArray[i].descricao+'</li>';
				segmento = jsonArray[i].idsegmento;
			}
			
			html += 
			'<li id="'+(i).toString()+'" data-id="'+jsonArray[i].idempresa+'">'+
				'<a href="#">'+
					'<div class="figura_segmentos"><img class="img_segmentos" src="'+imagem+jsonArray[i].logo+'" /></div>'+
					'<div class="segmentos">'+
						'<div class="vertical"><b>'+jsonArray[i].nome_fantasia+'</b></div>'+
						'<div class="vertical txt_azules">Distância:</div>'+
						'<div class="vertical txt_azules">Tempo Estimado:</div>'+
						'<div class="vertical txt_azules">Taxa de Entrega: <b>R$ '+jsonArray[i].taxa_entrega+'</b></div>'+
					'</div>'+
				'</a>'+
				'<a href="#" class="seloja" id="bt_seloja"></a>'+
			'</li>';
		}
				
	   	$("#lista_segmentos").html(html);
	   	$("#lista_segmentos").listview('refresh'); 
 	}
}				
	
