		    $("#pedidos").on("pageinit", function() 
			{
		    	cliente = $.makeArray(JSON.parse(sessionStorage.cliente));
		    	$.ajax(
				{
					type: "GET",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					async: "true",
				    url:  sessionStorage.server+"/wolke/wolke.php?JOB=pedidos&MTD=ultimo_pedido",
				    data: 'cliente='+cliente[0].idcliente,
				    success: function(msg) 
				    {
				    	jsonArray = $.makeArray(msg);
				    },
				    complete: function()
				    {
			    		//Numero Pedido
						painel_acompanha(jsonArray[0].idpedidos);
						itens_pedido(jsonArray[0].idpedidos);
				    },
				    error: function(msg) 
				    { popup_ok("PEDIDOS: Erro [3] na pesquisa de dados"); }
				});
			});
		    
		    function itens_pedido(pedido)
		    {
				valor_itens = 0.00;
				valor_total = 0.00;
				
				$.ajax(
				{
					type: "GET",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					async: "true",
				    url:  sessionStorage.server+"/wolke/wolke.php?JOB=pedidos&MTD=seleciona_pedido",
				    data: 'pedido='+pedido,
				    success: function(msg) 
				    {
				    	jsonArray = $.makeArray(msg);
				    	taxa_entrega = parseFloat(jsonArray[0].taxa_entrega);
				    	distancia = jsonArray[0].distancia.split(";");
				    	f_pagto = jsonArray[0].fp_descricao;
				    },
				    complete: function()
				    {
			    		//Dados Loja
						html = '<b>'+jsonArray[0].nome_fantasia+'</b><br/>'+
							   jsonArray[0].e_endereco+', '+jsonArray[0].e_numero+' '+jsonArray[0].e_complemento+'<br/>'+
							   jsonArray[0].e_bairro+' - '+jsonArray[0].e_municipio_descricao+'/'+jsonArray[0].e_uf_sigla+'<br/>'+
							   'Telefone: '+jsonArray[0].telefone+'<br/>'+
							   'Distância: '+distancia[0]+'<br/>'+
							   'Tempo Estimado: '+distancia[1];
						html += '<div class="linha_trac"></div>';

						$(".dados_loja").html(html);
					    $(".dados_loja").trigger('create'); 
						$(".dados_loja").show();

						//Dados Entrega
						html = '<b>Local de Entrega:</b><br/>'+
								jsonArray[0].c_endereco+', '+jsonArray[0].c_numero+' '+jsonArray[0].c_complemento+'<br/>'+
								jsonArray[0].c_bairro+' - '+jsonArray[0].c_municipio_descricao+'/'+jsonArray[0].c_uf_sigla+'<br/>'+
							   'Referência: '+jsonArray[0].c_referencia;
						html += '<div class="linha_trac"></div>';

						$(".dados_cliente").html(html);
						$(".dados_cliente").trigger('create'); 
						$(".dados_cliente").show();

						$.ajax(
						{
							type: "GET",
							contentType: "application/json; charset=utf-8",
							dataType: "json",
							async: "true",
						    url:  sessionStorage.server+"/wolke/wolke.php?JOB=pedidos&MTD=itens",
						    data: 'pedido='+pedido,
						    success: function(msg) 
						    {
						    	jsonArray = $.makeArray(msg);
						    },
						    complete: function()
						    {
						   		//Itens Pedido
						    	html = '';

						    	for(i=0; i < jsonArray.length; i++)
						    	{
						    		valor_itens = (valor_itens+(jsonArray[i].preco_venda*jsonArray[i].quantidade));
						    		
									html += '<div class="vertical verover">'+
												'<div class="horizontal di_a">'+
													'<b>'+jsonArray[i].descricao+'</b><br/>'+
													jsonArray[i].complemento+'<br/>'+
													jsonArray[i].apresentacao+'<br/>'+
													jsonArray[i].fornecedor+'<br/>'+
												'</div>'+
												'<div class="horizontal di_bc">'+parseFloat(jsonArray[i].preco_venda).toFixed(2)+'<br/>x '+jsonArray[i].quantidade+'</div>'+
												'<div class="horizontal di_bc">'+parseFloat(jsonArray[i].preco_venda*jsonArray[i].quantidade).toFixed(2)+'</div>'+
											'</div>';
						    	}

						    	valor_total = (valor_itens+taxa_entrega);

								html += '<div class="linha_trac"></div>';
								html += '<div class="vertical verover">'+
											'<div class="horizontal di_a">&nbsp;</div>'+
											'<div class="horizontal di_bc">Produtos:<br/></div>'+
											'<div class="horizontal di_bc">'+parseFloat(valor_itens).toFixed(2)+'</div>'+
										'</div>'+
										'<div class="vertical verover">'+
											'<div class="horizontal di_a">&nbsp;</div>'+
											'<div class="horizontal di_bc">Tx. Entrega:<br/></div>'+
											'<div class="horizontal di_bc">'+parseFloat(taxa_entrega).toFixed(2)+'</div>'+
										'</div>'+
										'<div class="vertical verover">'+
											'<div class="horizontal di_a">&nbsp;</div>'+
											'<div class="horizontal di_bc"><b>Total:</b><br/></div>'+
											'<div class="horizontal di_bc"><b>'+parseFloat(valor_total).toFixed(2)+'</b></div>'+
										'</div>';
								html += '<div class="linha_trac"></div>';
								html += '<div class="vertical verover">'+
											'<div class="horizontal di_a">Forma de Pagamento: '+f_pagto+'</div>'+
										'</div>';
								html += '<div class="linha_trac"></div>';

								$(".dados_itens").html(html);
								$(".dados_itens").trigger('create'); 
								$(".dados_itens").show();
								    	
						    },
						    error: function(msg) 
						    { alert("PEDIDOS: Erro [2] na pesquisa de dados"); /*popup_ok("PRODUTOS: Erro na pesquisa de dados"); */ }
						});
				    },
				    error: function(msg) 
				    { alert("PEDIDOS: Erro [1] na pesquisa de dados"); /*popup_ok("PRODUTOS: Erro na pesquisa de dados"); */ }
				});
		    }
		    
			$("#pedidos").on("click", "#bt_voltar_c", function()
			{ $(window.document.location).attr('href','produtos.html'); });
			
			function painel_acompanha(pedido)
			{
				var html7 = ''; 
				var html8 = '';
						
				html7 = '<div class="vertical verover">'+
						'<div class="clabel_pagto">'+
							'<b>Pedido N&ordm; '+pedido+'</b>'+
						'</div>'+
						'<div class="cimg_pagto">'+
							'<a href="#" data-theme="p" id="bt_pbaixo_pagto"><img id="ci_pagto" src="imagens/pbaixo_28cze.png" /></a>'+
						'</div>'+
						'</div>'+
						'<div class="detalhes"></div>';

				$.ajax(
				{
					type: "GET",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					assync: true,
					url:    sessionStorage.server+"/wolke/wolke.php?JOB=pedidos&MTD=lista_status_pedido",
					data: 'pedido='+pedido,
					success: function(msg) 
					{
						jsonArray = $.makeArray(msg);
					},
					complete: function()
					{ 
						for(i=0; i < jsonArray.length; i++)
				    	{
							html8 += '<div class="vertical verover">'+
									 '<div class="horizontal">'+
									   '<div class="icone_status i_verdex">&#10004;</div>'+
									 '<div class="horizontal">'+jsonArray[i].descricao+'</div>'+
									 '<div class="horizontal">'+jsonArray[i].data+'</div>'+
									 '</div>'+
									 '</div>';
				    	}

						$(".detalhes").html(html8);
						$(".detalhes").trigger('create'); 
					},
					error: function(msg) 
					{ alert("PEDIDOS: Erro na pesquisa de dados"); }
				}); 
				
			    $(".num_pedido").html(html7);
			    $(".num_pedido").trigger('create'); 
			    

			    $(".num_pedido").on("click", "#bt_pbaixo_pagto", function()
				{ 
			    	$('.cimg_pagto').html('<a href="#" data-theme="p" id="bt_pcima_pagto"><img id="ci_pagto" src="imagens/pcima_28cze.png" /></a>'); 
				    $('.detalhes').show();
			    });
	
			    $(".num_pedido").on("click", "#bt_pcima_pagto", function()
				{ 
			    	$('.cimg_pagto').html('<a href="#" data-theme="p" id="bt_pbaixo_pagto"><img id="ci_pagto" src="imagens/pbaixo_28cze.png" /></a>'); 
				    $('.detalhes').hide();
			    });
			}
			

			

		    
		    
