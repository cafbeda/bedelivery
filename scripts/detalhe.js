			var jsonArray = new Array();
			
			$("#detalhe").on("pageinit", function() 
			{
				var html = '';
				item = sessionStorage.item_detalhe;    
		    	jsonArray = $.makeArray(JSON.parse(item));
				imagem = sessionStorage.server+"/produtos/";
				
		    	if (jsonArray.length > 0)
		    	{
					i = 0;
					html += 
					'<div id="figura_detalhe"><img id="img_detalhe" src="'+imagem+'180.'+jsonArray[i].imagem+'" /></div>'+
					'<div class="itens">'+
						'<div class="produto">'+jsonArray[i].descricao+'</div>'+
						'<div class="dados_itens">'+jsonArray[i].complemento+'</div>'+
						'<div class="dados_itens">'+jsonArray[i].apresentacao+'</div>'+
						'<div class="fornecedor_itens">'+jsonArray[i].fornecedor+'</div><br/>'+
						'<div class="loja_itens">'+jsonArray[i].nome_fantasia+'</div>';
						
						if (sessionStorage.detalhe == 1)
						{ html += '<div class="preco_promo">De R$ '+jsonArray[i].preco_venda+'</div>'; }
					
						if (sessionStorage.detalhe == 1)
						{ html += '<div class="preco_itens">Por R$ '+jsonArray[i].preco_promo+'</div>'; } else
						{ html += '<div class="preco_itens">Unitário R$ '+jsonArray[i].preco_promo+'</div>'; } 
						
						html += '</div>';

					if (sessionStorage.detalhe == 1)
					{ 
						$('#quantidade').val(parseFloat(jsonArray[i].fracao).toFixed(2)); 
						verifica_carrinho();
					} else
					{ $('#quantidade').val(parseFloat(jsonArray[i].quantidade).toFixed(2)); }

			    	$("#detalha_item").html(html);
			    	$("#detalha_item").trigger('create'); 
			    	
					html =  '<div class="vertical">&nbsp;</div>'+
							'<div class="vertical centro"><h4>Quantidade [ '+jsonArray[i].unidade+' ]</h4></div>';
					$('#c_label').html(html);
					
					if (sessionStorage.detalhe == 1)
					{
						html =  '<div class="vertical">'+
									'<div class="horizontal bad_adicionar">'+
										'<a href="#" id="adicionar" data-theme="p" class="verde" data-role="button">Adicionar</a>'+
									'</div>'+
									'<div class="horizontal bad_voltar">'+
										'<a href="#" id="voltar" data-theme="p" class="laranja" data-role="button">Voltar</a>'+
									'</div>'+
								'</div>';
					} else
					{
						html =  '<div class="vertical">'+
								'<div class="horizontal bal_adicionar">'+
									'<a href="carrinho.html" id="alterar" data-theme="p" class="verde" data-role="button">Alterar</a>'+
								'</div>'+
								'<div class="horizontal bal_excluir">'+
									'<a href="carrinho.html" id="excluir" data-theme="p" class="vermelho" data-role="button">Excluir</a>'+
								'</div>'+
								'<div class="horizontal bal_voltar">'+
									'<a href="carrinho.html" id="voltar" data-theme="p" class="laranja" data-role="button">Voltar</a>'+
								'</div>'+
							'</div>';
					}
						
					$('#b_detalhe').html(html);
			    	$("#b_detalhe").trigger('create'); 
				} else
	 			{ popup_ok("Detalhe: Item Não pode ser detalhado"); }		 
				
			}); 

			// CAMPO QUANTIDADE
			$("#detalhe").on("change", "#quantidade", function()
			{ 
				// MENOS
				if ($('#quantidade').val() < parseFloat(jsonArray[i].fracao))
				{ 
					val_q = (parseFloat(jsonArray[i].fracao)).toFixed(2);
					$('#quantidade').val(val_q); 
				}

				// MAIS
				if ($('#quantidade').val() > (parseFloat(jsonArray[i].estoque)-parseFloat(jsonArray[i].reserva)))
				{ 
					val_q = (parseFloat(jsonArray[i].estoque)-parseFloat(jsonArray[i].reserva)).toFixed(2);
					$('#quantidade').val(val_q); 
				}
			});
			
			// BOTAO MENOS
			$("#detalhe").on("click", "#bt_menos", function()
			{ menos(); });
			
			// BOTAO MAIS
			$("#detalhe").on("click", "#bt_mais", function()
			{ mais(); });
			
			function menos()
			{
				if ($('#quantidade').val() > parseFloat(jsonArray[i].fracao))
				{ 
					val_q = (parseFloat($('#quantidade').val())-parseFloat(jsonArray[i].fracao)).toFixed(2);
					$('#quantidade').val(val_q); 
				}
			}
				
			function mais()
			{
				if ($('#quantidade').val() < (parseFloat(jsonArray[i].estoque)-parseFloat(jsonArray[i].reserva)))
				{ 
					val_q = (parseFloat($('#quantidade').val())+parseFloat(jsonArray[i].fracao)).toFixed(2);
					$('#quantidade').val(val_q); 
				}
			}
				
			$("#detalhe").on("click", "#adicionar", function()
			{
    			var db = openDatabase("bedelivery", "1.0", "bedelivery", 200000);
	   			db.transaction(insertDB, errorDB, successDB);
	   			
	   			function insertDB(tx)
	   			{
					sql = 'insert into carrinho (codebar,idempresa,idgrupo,quantidade,fracao,estoque,reserva,descricao,complemento,'+
						  'apresentacao,unidade,fornecedor,nome_fantasia,preco_promo,preco_venda,imagem,codigo_referencia) values '+	   
						  '("'+jsonArray[i].codebar+'",'+
						  jsonArray[i].idempresa+','+
						  jsonArray[i].idgrupo+','+
						  $("#quantidade").val()+','+
						  jsonArray[i].fracao+','+
						  jsonArray[i].estoque+','+
						  jsonArray[i].reserva+',"'+
						  jsonArray[i].descricao+'","'+
						  jsonArray[i].complemento+'","'+
						  jsonArray[i].apresentacao+'","'+
						  jsonArray[i].unidade+'","'+
						  jsonArray[i].fornecedor+'","'+
						  jsonArray[i].nome_fantasia+'",'+
						  jsonArray[i].preco_promo+','+
						  jsonArray[i].preco_venda+',"'+
						  jsonArray[i].imagem+'","'+
						  jsonArray[i].codigo_referecia+'")';
						  
	   				tx.executeSql(sql);
	   			}
	    			
	   			function successDB()
	   			{
   					sessionStorage.idreset = 1; 

   					if (sessionStorage.idempresa == '')
	   				{ 
						endereco = $.makeArray(JSON.parse(sessionStorage.endereco));
	   					sessionStorage.idempresa = jsonArray[i].idempresa;
	   					seleciona_loja(sessionStorage.idempresa, endereco[0].idenderecos, formas_pagto, 1);
	   				} else
	   				{ $(window.document.location).attr('href','produtos.html'); }
	   			}
	   			
	   			function errorDB()
	   			{ popup_ok('Detalhe: Produto Não Adicionado ao Carrinho'); }
			});

			$("#detalhe").on("click", "#voltar", function()
			{ $(window.document.location).attr('href','produtos.html'); });
			
			$("#detalhe").on("click", "#alterar", function()
			{
    			var db = openDatabase("bedelivery", "1.0", "bedelivery", 200000);
	   			db.transaction(insertDB, errorDB, successDB);
	   			
	   			function insertDB(tx)
	   			{
					sql = 'update carrinho set quantidade = '+$("#quantidade").val()+' where codebar = "'+jsonArray[i].codebar+'"';
	   				tx.executeSql(sql);
	   			}
	    			
	   			function successDB()
	   			{
	   			}
	   			
	   			function errorDB()
	   			{ popup_ok('Detalhe: Produto Não Alterado no Carrinho'); }
			});
			
			$("#detalhe").on("click", "#excluir", function()
			{
    			var db = openDatabase("bedelivery", "1.0", "bedelivery", 200000);
	   			db.transaction(insertDB, errorDB, successDB);
	   			
	   			function insertDB(tx)
	   			{
					sql = 'delete from carrinho where codebar = "'+jsonArray[i].codebar+'"';
	   				tx.executeSql(sql);
	   			}
	    			
	   			function successDB()
	   			{ 
	    			var db = openDatabase("bedelivery", "1.0", "bedelivery", 200000);
	   				db.transaction(consultaCB,errorCB);
	   				
		   			function consultaCB(tx)
		   			{
		   				sql = 'select * from carrinho';
			   			tx.executeSql(sql,[],successCB,errorCB);
					}

		   			function successCB(tx,result)
		   			{
						if (result.rows.length > 0)
						{ $(window.document.location).attr('href','carrinho.html'); } else
						{ 
			   				sessionStorage.idempresa = '';
			   				sessionStorage.melhor = '';
			   				sessionStorage.loja = '';
							$(window.document.location).attr('href','produtos.html');
						}
		   			}
		   			
		   			function errorCB()
		   			{ popup_ok("CARRINHO: Erro no acesso aos Dados"); }
	   			}
	   			
	   			function errorDB()
	   			{ popup_ok('Detalhe: Produto Não Excluido do Carrinho'); }
			});
			
			function verifica_carrinho()
			{
    			var db = openDatabase("bedelivery", "1.0", "bedelivery", 200000);
	   			db.transaction(consultaDB, errorDB);
	   			
	   			function consultaDB(tx)
	   			{
					sql = 'select codebar from carrinho where codebar = "'+jsonArray[i].codebar+'"';	
		   			tx.executeSql(sql,[],successDB,errorDB);
	   			}
	    			
	   			function successDB(tx,result)
	   			{ 
	   				if (result.rows.length > 0)
	   				{ 
	   					$("#adicionar").hide();
	   					$(".bad_voltar").css("width", "80%");
	   					$(".bad_voltar").css("padding", "0 10% 0 10%");
	   					
						html = 	'<div class="vertical">&nbsp;</div>'+
								'<div class="vertical centro"><h3>Produto Já Adicionado ao Carrinho</h3></div>';
	   					$("#existe").html(html);
	   					$("#existe").trigger('create'); 
	   				}
	   			}
	   			
	   			function errorDB()
	   			{ popup_ok('Detalhe: Erro na consulta ao Carrinho'); }
			}
