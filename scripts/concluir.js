			var melhor_orcamento = '';
			var dados = new Array();
			var fp_valor = '';
			var fp_nome  = '';
			var fp_troco = 0;
			
		    $("#concluir").on("pageinit", function() 
			{
				var db = openDatabase("bedelivery", "1.0", "bedelivery", 200000);
	   			db.transaction(consultaDB, errorDB);
	   			
	   			function consultaDB(tx)
	   			{
	   				sql = 'select * from carrinho';
		   			tx.executeSql(sql,[],successDB,errorDB);
	   			}
	    			
	   			function successDB(tx,result)
	   			{ 
					valor_itens = 0.00;
					valor_total = 0.00;
					loja = $.makeArray(JSON.parse(sessionStorage.loja));
			    	taxa_entrega = parseFloat(loja[0].taxa_entrega);

			    	for(i=0; i < result.rows.length; i++)
			    	{
			    		linha = result.rows.item(i);
			    		valor_itens = (valor_itens+(linha['preco_promo']*linha['quantidade']));
			    		
						dados[i] = result.rows.item(i);
			    	}
			    	
			    	valor_total = (valor_itens+taxa_entrega);
			    	
					loja = $.makeArray(JSON.parse(sessionStorage.loja));
					o_loja = {};
			    	o_loja["idempresa"] = loja[0].idempresa;
			    	o_loja["taxa_entrega"] = loja[0].taxa_entrega;
			    	o_loja = JSON.stringify(o_loja);
			    	o_loja = $.makeArray(JSON.parse(o_loja));
			    	o_loja = JSON.stringify(o_loja);
			    	
					loja = sessionStorage.loja;
					endereco = $.makeArray(JSON.parse(sessionStorage.endereco));
			    	cod_endereco = endereco[0].idenderecos;
			    	
			    	f_itens = [];
			    	for(i=0; i < dados.length; i++)
			    	{
			    		itens = {};
			    		itens.codebar = dados[i].codebar;
			    		itens.preco_promo = dados[i].preco_promo;
			    		itens.quantidade = dados[i].quantidade;
			    		f_itens.push(itens);
			    	}							
			    	itens_f = JSON.stringify(f_itens);
			    	
			    	$.ajax(
					{
						type: "GET",
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						async: "true",
					    url:  sessionStorage.server+"/wolke/wolke.php?JOB=concluir&MTD=melhor_orcamento",
					    data: 'loja='+o_loja+'&dados='+itens_f+'&cod_endereco='+cod_endereco,
					    success: function(msg) 
					    {
							melhor_orcamento = $.makeArray(msg);
						},
					    complete: function()
					    {
							if (sessionStorage.melhor == '')
							{
								if ((parseFloat(melhor_orcamento[0].preco_total)+parseFloat(melhor_orcamento[0].taxa_entrega)) < (valor_total))
								{ 
									html =  '<div class="horizontal cifrao_orcamento t_laranja">$</div>'+
											'<div class="horizontal preco_orcamento">'+
											'<div class="preco_total" id="oc_produtos">Produtos: <b>R$ '+parseFloat(valor_itens).toFixed(2)+'</b></div>'+
											'<div class="preco_total" id="tx_entrega">Tx. entrega: <b>R$ '+parseFloat(taxa_entrega).toFixed(2)+'</b></div>'+
											'<div class="linha"></div>'+
											'<div class="preco_total" id="oc_total">Total: <b>R$ '+parseFloat(valor_total).toFixed(2)+'</b></div>'+
											'</div>';
			
									$(".c_carrinho").html(html);
									$(".c_carrinho").trigger('create'); 
									$(".c_carrinho").show();

									painel_loja();
									seleciona_loja(melhor_orcamento[0].idempresa, cod_endereco, painel_melhor, 0);
	
									valor_itens_m = parseFloat(melhor_orcamento[0].preco_total);
									tx_entrega_m  = parseFloat(melhor_orcamento[0].taxa_entrega);
									valor_total_m = parseFloat(valor_itens_m+tx_entrega_m);
									
									html =	'<div class="horizontal cifrao_orcamento t_verde">$</div>'+
											'<div class="horizontal preco_orcamento">'+
											'<div class="preco_total" id="oc_produtos">Produtos: <b>R$ '+parseFloat(valor_itens_m).toFixed(2)+'</b></div>'+
											'<div class="preco_total" id="tx_entrega">Tx. entrega: <b>R$ '+parseFloat(tx_entrega_m).toFixed(2)+'</b></div>'+
											'<div class="linha"></div>'+
											'<div class="preco_total" id="oc_total">Total: <b>R$ '+parseFloat(valor_total_m).toFixed(2)+'</b></div>'+	
											'</div>';
	
									$(".m_carrinho").html(html);
								    $(".m_carrinho").trigger('create'); 
								    
									$(".m_loja").show();
									$(".m_carrinho").show();
									$(".m_botoes").show();
								} else
								{ sessionStorage.melhor = '$'; }
							}
							
					    	if (sessionStorage.melhor != '')
					    	{
					    		painel_fpagto();
					    		
					    		//Dados Loja
								loja = $.makeArray(JSON.parse(sessionStorage.loja));
								html = '<b>'+loja[0].nome_fantasia+'</b><br/>'+
									   loja[0].endereco+', '+loja[0].numero+' '+loja[0].complemento+'<br/>'+
									   loja[0].bairro+' - '+loja[0].municipio_descricao+'/'+loja[0].uf_sigla+'<br/>'+
									   'Telefone: '+loja[0].telefone+'<br/>'+
									   'Distância: '+loja[0].distancia+'<br/>'+
									   'Tempo Estimado: '+loja[0].duracao;
								html += '<div class="linha_trac"></div>';

								$(".dados_loja").html(html);
							    $(".dados_loja").trigger('create'); 
								$(".dados_loja").show();
											
					    		//Dados Entrega
								html = '<b>Local de Entrega:</b><br/>'+
										endereco[0].endereco+', '+endereco[0].numero+' '+endereco[0].complemento+'<br/>'+
										endereco[0].bairro+' - '+endereco[0].municipio_descricao+'/'+endereco[0].uf_sigla+'<br/>'+
									   'Referência: '+endereco[0].referencia;
								html += '<div class="linha_trac"></div>';

								$(".dados_cliente").html(html);
								$(".dados_cliente").trigger('create'); 
								$(".dados_cliente").show();
												
					    		//Itens
								html = '';
								itens = dados;
								for (i=0; i < itens.length; i++)
								{
									html += '<div class="vertical verover">'+
												'<div class="horizontal di_a">'+
													'<b>'+itens[i].descricao+'</b><br/>'+
													itens[i].complemento+'<br/>'+
													itens[i].apresentacao+'<br/>'+
													itens[i].fornecedor+'<br/>'+
												'</div>'+
												'<div class="horizontal di_bc">'+parseFloat(itens[i].preco_promo).toFixed(2)+'<br/>x '+itens[i].quantidade+'</div>'+
												'<div class="horizontal di_bc">'+parseFloat(itens[i].preco_promo*itens[i].quantidade).toFixed(2)+'</div>'+
											'</div>';
								}

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

								$(".dados_itens").html(html);
								$(".dados_itens").trigger('create'); 
								$(".dados_itens").show();
								
					    		//footer
					    		html = '<div id="footer_c" data-role="footer" data-position="fixed" data-theme="p" data-tap-toggle="false">'+
					    				'<div class="vertical b_enviar">'+
									    	'<a href="#" data-theme="p" id="bt_enviar" class="verde" data-role="button">Enviar Pedido</a>'+
									    '</div>'+
									   '</div>';

								$("#footer_f").html(html);
							    $("#footer_f").trigger('create'); 
					    	}
					    },
					    error: function(msg) 
					    { popup_ok("PEDIDO: Erro na avaliação do Melhor Orçamento"); }
					});
	   			}
	   			
	   			function errorDB()
	   			{ popup_ok("PEDIDO: Erro [1] na consulta ao Carrinho"); }

				// Remonta Carrinho por Melhor Orçamento
				$("#popup").on("click", "#popup_sim", function()
				{ 
					//
				});

				$("#concluir").on("click", "#bt_orcado_fim", function()
				{ 
					sessionStorage.melhor = '$';
					location.reload();
				});

				$("#concluir").on("click", "#bt_melhor_fim", function()
				{ 
					monta_carrinho();
				});

				$("#concluir").on("click", "#bt_enviar", function()
				{ 
					if (sessionStorage.login_status == 9)
					{
						$(window.document.location).attr('href','cadastro.html');
					} else
					{
						if (fp_valor != '')
						{
							
							var f_dados = {}; var f_itens = [];
		
							login = $.makeArray(JSON.parse(sessionStorage.cliente));
							loja = $.makeArray(JSON.parse(sessionStorage.loja));
							endereco = $.makeArray(JSON.parse(sessionStorage.endereco));
							
					    	for(i=0; i < dados.length; i++)
					    	{
					    		itens = {};
					    		itens.codebar = dados[i].codebar;
					    		itens.preco_promo = dados[i].preco_promo;
					    		itens.quantidade = dados[i].quantidade;
					    		f_itens.push(itens);
					    	}							
					    	
					    	itens_f = JSON.stringify(f_itens);
							
							f_dados["idcliente"] = login[0].idcliente;
							f_dados["fpcodigo"] = fp_valor;
							f_dados["troco"] = fp_troco;
							//f_dados["troco"] = str_replace(",",".", dados["troco"]);
							//f_dados["troco"] = number_format(dados["troco"],2,".",",");
							
							f_dados["idempresa"] = loja[0].idempresa;
							f_dados["taxa_entrega"] = loja[0].taxa_entrega;
							f_dados["distancia"] = loja[0].distancia+";"+loja[0].duracao;
							f_dados["idendereco"] = endereco[0].idenderecos;
							f_dados["status"] = 20; // Status Inicial: Enviado para Loja
							f_dados["itens"] = itens_f;
							
							dados_f = JSON.stringify(f_dados);
							
					    	$.ajax(
							{
								type: "GET",
								contentType: "application/json; charset=utf-8",
								dataType: "json",
								async: "true",
							    url:  sessionStorage.server+"/wolke/wolke.php?JOB=concluir&MTD=finalizar_pagto",
							    data: 'dados='+dados_f,
							    success: function(msg) 
							    {
									sessionStorage.texto_pesquisa = '';
									sessionStorage.melhor = '';
									esvaziar_carrinho(abrir_pedido);
								},
							    complete: function()
							    {
								},
							    error: function(msg) 
							    { popup_ok("PEDIDO: Erro ao Enviar o Pedido"); }
							});
						} else
						{ popup_ok("PEDIDO: Informe a Forma de Pagamento"); }
					}
				});
			});
		    
			$("#header_f").on("click", "#bt_voltar_f", function()
			{ $(window.document.location).attr('href','carrinho.html'); });
			
			function monta_carrinho()
		    {
		    	f_itens = [];
		    	for(i=0; i < dados.length; i++)
		    	{
		    		itens = {};
		    		itens.codebar = dados[i].codebar;
		    		itens.preco_promo = dados[i].preco_promo;
		    		itens.quantidade = dados[i].quantidade;
		    		f_itens.push(itens);
		    	}							
		    	itens_f = JSON.stringify(f_itens);
		    	
		    	$.ajax(
				{
					type: "GET",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					async: "true",
				    url:  sessionStorage.server+"/wolke/wolke.php?JOB=concluir&MTD=monta_carrinho",
				    data: 'loja='+melhor_orcamento[0].idempresa+'&dados='+itens_f,
				    success: function(msg) 
				    {
						jsonArray = $.makeArray(msg);

						if (jsonArray.length > 0)
						{
						  	for(i=0; i < jsonArray.length; i++)
						   	{ 
								sql = 'update carrinho set '+
									  'idempresa = '+jsonArray[i].idempresa+','+
									  'descricao = "'+jsonArray[i].descricao+'",'+
									  'complemento = "'+jsonArray[i].complemento+'",'+
									  'apresentacao = "'+jsonArray[i].apresentacao+'",'+
									  'unidade = "'+jsonArray[i].unidade+'",'+
									  'nome_fantasia = "'+jsonArray[i].nome_fantasia+'",'+
									  'fornecedor = "'+jsonArray[i].fornecedor+'",'+
									  'preco_promo = '+jsonArray[i].preco_promo+','+
									  'preco_venda = '+jsonArray[i].preco_venda+','+
									  'codigo_referencia = "'+jsonArray[i].codigo_referencia+'" '+
									  'where codebar = "'+jsonArray[i].codebar+'"';

								atualiza_carrinho(sql);
						   	}
	
							endereco = $.makeArray(JSON.parse(sessionStorage.endereco));
		   					sessionStorage.idempresa = melhor_orcamento[0].idempresa;
		   					seleciona_loja(sessionStorage.idempresa, endereco[0].idenderecos, formas_pagto, 2);
						}
					},
					complete: function()
					{
	   				},
				    error: function(msg) 
				    { popup_ok("PEDIDO: Erro ao Reprocessar o Carrinho"); }
				});
		    }
		    
			function atualiza_carrinho(sql)
			{
				var db = openDatabase("bedelivery", "1.0", "bedelivery", 200000);
				db.transaction(insertDB, errorDB, successDB);
				
				function insertDB(tx)
				{
					tx.executeSql(sql);
				}
					
				function successDB()
				{ /*  */	}
				
				function errorDB()
				{ popup_ok('Erro ao atualizar o Carrinho'); }
			}
			
			function painel_fpagto()
			{
				html5 = ''; html6 = '';
				html5 += 
				'<div class="cf_pagto">'+
					'<div class="clabel_pagto">'+
						'Forma de Pagamento<br/><b>Selecione...</b>'+
					'</div>'+
					'<div class="cimg_pagto">'+
						'<a href="#" data-theme="p" id="bt_pbaixo_pagto"><img id="ci_pagto" src="imagens/forma_pagto.png" /></a>'+
					'</div>'+
				'</div>';
						
				logo = sessionStorage.server+"/logos/fpagto/";
				fpagto = $.makeArray(JSON.parse(sessionStorage.formas_pagto));

				html6 +=  '<fieldset data-role="controlgroup" data-theme="p" data-mini="true">';

				for (i=0; i < fpagto.length; i++)
				{
					html6 += '<input type="radio" name="radio-choice" id="'+fpagto[i].descricao+'" value="'+fpagto[i].fpcodigo+'" />'+
						     '<label for="'+fpagto[i].descricao+'">'+
							     '<div id="img_fpagto"><img src="'+logo+fpagto[i].logo+'" height="17.55" width="27.3" /></div>'+
							     fpagto[i].descricao+
						     '</label>';
				}
					    		
				html6 += '</fieldset>';
			    $('#pagamento').hide();
			    $("#pagamento").html(html6);
			    $("#pagamento").trigger('create'); 

			    $(".forma_pagto").html(html5);
			    $(".forma_pagto").trigger('refresh'); 

			    $(".forma_pagto").on("click", "#bt_pbaixo_pagto", function()
				{ 
			    	$('.cimg_pagto').html('<a href="#" data-theme="p" id="bt_pcima_pagto"><img id="ci_pagto" src="imagens/pcima_28cze.png" /></a>'); 
				    $('#pagamento').show();
			    });
	
			    $(".forma_pagto").on("click", "#bt_pcima_pagto", function()
				{ 
			    	$('.cimg_pagto').html('<a href="#" data-theme="p" id="bt_pbaixo_pagto"><img id="ci_pagto" src="imagens/forma_pagto.png" /></a>'); 
				    $('#pagamento').hide();
			    });
			}
			
			$('#pagamento').delegate('input:radio[name="radio-choice"]', 'change', function() 
		    {
				fp_valor = $("input:radio[name='radio-choice']:checked").val();
				fp_nome  = 'Forma de Pagamento<br/><b>'+$("input:radio[name='radio-choice']:checked").attr('id')+'</b>';
			    $(".clabel_pagto").html(fp_nome);
			    $(".clabel_pagto").trigger('create'); 
			    
			    //Troco Para
		    });	
			