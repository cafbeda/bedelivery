			var carrinho = '';

		    $("#carrinho").on("pageshow", function() 
			{
				sessionStorage.melhor = '';
				if (sessionStorage.idempresa != '')
				{
					painel_loja();
					html = '<div id="footer_c" data-role="footer" data-position="fixed" data-theme="p" data-tap-toggle="false">'+
								'<div class="vertical">'+
									'<div class="horizontal b_concluir">'+
										'<a href="#" data-theme="p" id="bt_concluir" class="verde" data-role="button">Concluir</a>'+
									'</div>'+
									'<div class="horizontal b_esvaziar">'+
										'<a href="#" data-theme="p" id="bt_esvaziar" class="vermelho" data-role="button">Esvaziar</a>'+
									'</div>'+
								'</div>'+
						   '</div>';

					$("#footer_p").html(html);
				    $("#footer_p").trigger('create'); 
				}

				sessionStorage.detalhe = 2;
				html = '';

    			var db = openDatabase("bedelivery", "1.0", "bedelivery", 200000);
   				db.transaction(consultaCB,errorCB);
   				
	   			function consultaCB(tx)
	   			{
	   				sql = 'select * from carrinho';
		   			tx.executeSql(sql,[],successCB,errorCB);
				}
					    			
	   			function successCB(tx,result)
	   			{
					imagem = sessionStorage.server+"/produtos/";
					var lista = $("#lista_carrinho");
					var html  = '';

					$("#lista_carrinho").empty();
					
					if (result.rows.length > 0)
					{
						valor_itens = 0.00;
						valor_total = 0.00;
						loja = $.makeArray(JSON.parse(sessionStorage.loja));
				    	taxa_entrega = parseFloat(loja[0].taxa_entrega);
						carrinho = result.rows;
						
						html += '<li data-role="list-divider" data-theme="p">'+(result.rows.length).toString()+' produto(s) no Carrinho</li>';
					  	for(i=0; i < result.rows.length; i++)
					   	{
							linha = result.rows.item(i);
				    		valor_itens = (valor_itens+(linha['preco_promo']*linha['quantidade']));
							
							html += 
							'<li id="'+(i).toString()+'" data-id="'+linha['codebar']+'">'+
								'<a href="#">'+
									'<div id="figura_itens"><img src="'+imagem+linha['imagem']+'" /></div>'+
									'<div class="itens">'+
										'<div class="produto">'+linha['descricao']+'</div>'+
										'<div class="dados_itens">'+linha['complemento']+'</div>'+
										'<div class="dados_itens">'+linha['apresentacao']+'</div>'+
										'<div class="fornecedor_itens">'+linha['fornecedor']+'</div><br/>'+
										// Remover Depois
										//'<div class="loja_itens">'+linha['nome_fantasia']+'</div>'+
										//
										'<div class="preco_itens" id="pr_unitario">Unitário R$ '+parseFloat(linha['preco_promo']).toFixed(2)+'</div>'+
										'<div class="preco_itens" id="qtde_atual">Quantidade '+parseFloat(linha['quantidade']+' '+linha['unidade']).toFixed(2)+'</div>'+
										'<div class="preco_itens" id="pr_total">Total R$ '+parseFloat(linha['preco_promo']*linha['quantidade']).toFixed(2)+'</div>'+
									'</div>'+
								'</a>'+
								'<a href="detalhe.html" class="edtcart" id="bt_chgcart"></a>'+
							'</li>';
						}
					  	
				    	$("#lista_carrinho").html(html);
				    	$("#lista_carrinho").listview('refresh'); 

				    	valor_total = (valor_itens+taxa_entrega);
				    	
						html = '<div class="preco_total" id="oc_produtos">Produtos: <b>R$ '+parseFloat(valor_itens).toFixed(2)+'</b></div>'+
							   '<div class="preco_total" id="tx_entrega">Tx. entrega: <b>R$ '+parseFloat(taxa_entrega).toFixed(2)+'</b></div>'+
							   '<div class="linha"></div>'+
							   '<div class="preco_total" id="oc_total">Total: <b>R$ '+parseFloat(valor_total).toFixed(2)+'</b></div>';

						$(".c_carrinho").html(html);
					    $(".c_carrinho").trigger('create'); 
						$(".c_carrinho").show();
					} else
					{ esvaziar_carrinho(abrir_produtos); }
	   			}
	   			
	   			function errorCB()
	   			{ /*popup_ok("CARRINHO: Erro no acesso aos Dados");*/ }
			});

			$("#carrinho").on("click", "#bt_concluir", function()
			{
	    		$(window.document.location).attr('href','concluir.html');
			});

			$("#carrinho").on("click", "#bt_esvaziar", function()
			{
				esvaziar_carrinho(abrir_produtos);
			});

			function esvaziar_carrinho(callback)
			{
    			var db = openDatabase("bedelivery", "1.0", "bedelivery", 200000);
   				db.transaction(limpaCB,errorCB);
   				
	   			function limpaCB(tx)
	   			{
	   				sql = 'delete from carrinho';
		   			tx.executeSql(sql,[],successCB,errorCB);
				}

	   			function successCB(tx,result)
	   			{
	   				if (typeof callback === "function")
	   				{ callback(); }
	   			}
	   			
	   			function errorCB()
	   			{ /*popup_ok("Erro ao Limpar o Carrinho");*/ }
			}
			
			function abrir_pedido()
			{ 
				carrinho_vazio();
				$(window.document.location).attr('href','pedidos.html'); 
			}
			
			function abrir_produtos()
			{ 
				carrinho_vazio();
				$(window.document.location).attr('href','produtos.html'); 
			}
			
			function carrinho_vazio()
			{
   				sessionStorage.idempresa = '';
   				sessionStorage.melhor = '';
   				sessionStorage.loja = '';
			}

			$("#carrinho").on("click", "#bt_voltar_c", function()
			{ $(window.document.location).attr('href','produtos.html'); });
			
			$('#lista_carrinho').delegate('li', 'click', function() 
		    {
				var item = parseInt($(this).attr('id'));
				var produto = JSON.stringify(carrinho.item(item));
				sessionStorage.item_detalhe = produto;
		    });	
			
			