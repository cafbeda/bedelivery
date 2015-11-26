			var jsonArray = new Array();

			$("#lojas").on("pageinit", function() 
			{
				$("#header h1").html(sessionStorage.nome_fantasia);
				
				var lojas = $("#lojas_abertas");
				var html = '';

				$.ajax(
				{
					type: "GET",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					assync: true,
					url:    sessionStorage.server+"/wolke/wolke.php?JOB=lojas&MTD=lojas",
					data: 'segmento='+sessionStorage.idsegmento+'&cod_endereco=24&dados=null&fetch=true',
					success: function(msg) 
					{
						logo = sessionStorage.server+"/logos/";
					    jsonArray = $.makeArray(msg);
				    	if (jsonArray.length > 0)
				    	{
				    		if (sessionStorage.idempresa == '')
				    		{ seleciona_empresa(0); }
				    		
				    		lojas.empty();
						    for(i=0; i < jsonArray.length; i++)
						    {
								endereco_origem = jsonArray[i].endereco+", "+jsonArray[i].numero+" "+
		                        jsonArray[i].complemento+" - "+jsonArray[i].bairro+" - "+
		                        jsonArray[i].municipio_descricao+" / "+jsonArray[i].uf_sigla;						    
						    
								html += 
								'<li id="'+(i).toString()+'">'+
									'<a href="produtos.html">'+
									'<img src="'+logo+jsonArray[i].logo+'" height="120" width="120">'+
									'<b>'+jsonArray[i].nome_fantasia+'</b><br/>'+
									endereco_origem+'<br/>'+
									'Distância: '+jsonArray[i].distancia+'<br/>'+
									'Tempo Estimado: '+jsonArray[i].duracao+'<br/>'+
									'Taxa de Entrega: '+jsonArray[i].taxa_entrega+'<br/>'+
									'</a>'+
								'</li>';
							}
							
					    	$("#lojas_abertas").html(html);
					    	$("#lojas_abertas").listview('refresh'); 
						} else
			 			{ alert("Nenhuma Loja Aberta"); }		 
					},
					complete: function()
					{
						sessionStorage.lojas = JSON.stringify(jsonArray);
					},
					error: function(msg) 
					{ alert("LOJAS: Erro na pesquisa de dados"+'segmento='+sessionStorage.idsegmento+'&cod_endereco=24&dados=null&fetch=true'); }
				}); 
				
				$('#lojas_abertas').delegate('li', 'click', function() 
			    {
					item = parseInt($(this).attr('id'));
					seleciona_empresa(item);
			    });	
			}); 

			function seleciona_loja(loja, endereco, callback, origem)
			{
				$.ajax(
				{
					type: "GET",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					assync: true,
					url:    sessionStorage.server+"/wolke/wolke.php?JOB=lojas&MTD=seleciona_loja",
					data: 'loja='+loja+'&cod_endereco='+endereco,
					success: function(msg) 
					{
						jsonData = msg;
					},
					complete: function()
					{
						if (origem > 0)
						{ sessionStorage.loja = JSON.stringify(jsonData); } else
						{ sessionStorage.melhor = JSON.stringify(jsonData); }
						
						if (typeof callback === "function")
						{
							if (callback === painel_melhor)
							{ callback(sessionStorage.melhor); } else
							{ callback(sessionStorage.idempresa, origem); }
						}
					},
					error: function(msg) 
					{ alert("LOJAS: Erro na pesquisa de dados"); }
				}); 
			}
			
			function seleciona_empresa(item)
			{
				sessionStorage.empresa = JSON.stringify(jsonArray[item]);
				sessionStorage.idempresa = jsonArray[item].idempresa;
				sessionStorage.nome_fantasia = jsonArray[item].nome_fantasia;
			}
			
			function formas_pagto(loja, origem)
			{
				$.ajax(
				{
					type: "GET",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					assync: true,
					url:    sessionStorage.server+"/wolke/wolke.php?JOB=lojas&MTD=formas_pagto",
					data: 'loja='+loja,
					success: function(msg) 
					{
						jsonArray = $.makeArray(msg);
					},
					complete: function()
					{ 
						if (origem > 0)
						{ sessionStorage.formas_pagto = JSON.stringify(jsonArray); } else 
						{ sessionStorage.melhor_pagto = JSON.stringify(jsonArray); }
						if (origem == 1)
	   					{ $(window.document.location).attr('href','produtos.html'); }
						if (origem == 2)
	   					{ $(window.document.location).attr('href','concluir.html'); }
					},
					error: function(msg) 
					{ alert("LOJAS: Erro na pesquisa de dados"); }
				}); 
			}
			
			function seleciona_empresa(item)
			{
				sessionStorage.empresa = JSON.stringify(jsonArray[item]);
				sessionStorage.idempresa = jsonArray[item].idempresa;
				sessionStorage.nome_fantasia = jsonArray[item].nome_fantasia;
			}
			
			function painel_loja()
			{
				logoloja = sessionStorage.server+"/logos/empresas/";
				
				html1 = ''; html2 = '';
				loja = $.makeArray(JSON.parse(sessionStorage.loja));
				html1 += 
				'<div class="cna_loja">'+
					'<div class="clabel_loja">'+
						'Você está comprando na Loja<br/><b>'+loja[0].nome_fantasia+'</b>'+
					'</div>'+
					'<div class="cimg_ploja">'+
						'<a href="#" data-theme="p" id="bt_pbaixo_loja"><img id="ci_ploja" src="imagens/forma_pagto.png" /></a>'+
					'</div>'+
					'<div class="cimg_reset">'+
					'</div>'+
				'</div>';
						
				html2 += 
				'<div class="clabel_loja">'+
					'Distância: '+loja[0].distancia+'<br/>'+
					'Tempo Estimado: '+loja[0].duracao+'<br/>'+
					'Taxa de Entrega: '+loja[0].taxa_entrega+'<br/><br/>'+
					'<b>Aceitamos</b>'+
					'<div id="formas_pagto">';
								
					logo = sessionStorage.server+"/logos/fpagto/";
					fpagto = $.makeArray(JSON.parse(sessionStorage.formas_pagto));
					for (i=0; i < fpagto.length; i++)
					{
						html2 += '<div id="img_fpagto"><img src="'+logo+fpagto[i].logo+'" height="13.5" width="21" /></div>'+fpagto[i].descricao+'<br/>';
					}
					
					html2 += 
					'</div>'+
				'</div>';
					    
				$(".c_loja").html(html1);
			    $(".c_loja").trigger('refresh'); 
			    
			    if (sessionStorage.idreset == 2)
				{ 
			    	$(".cimg_reset").html('<a href="#" data-theme="p" id="bt_reset"><img id="ci_ploja" src="imagens/reset_28p.png" /></a>');
			    	$(".cimg_reset").trigger('create');
			    } else
			    {
			    	$(".cimg_reset").empty();
			    }

			    $(".c_loja").on("click", "#bt_pbaixo_loja", function()
				{ 
				    $(".c_loja").html(html1);
				    $(".c_loja").trigger('refresh'); 
			    	$('.cimg_ploja').html('<a href="#" data-theme="p" id="bt_pcima_loja"><img id="ci_ploja" src="imagens/pcima_28cze.png" /></a>'); 
				    $('.cna_loja').append(html2);

				    if (sessionStorage.idreset == 2)
					{ 
				    	$(".cimg_reset").html('<a href="#" data-theme="p" id="bt_reset"><img id="ci_ploja" src="imagens/reset_28p.png" /></a>');
				    	$(".cimg_reset").trigger('create');
				    } else
				    {
				    	$(".cimg_reset").empty();
				    }
			    });
	
			    $(".c_loja").on("click", "#bt_pcima_loja", function()
				{ 
			    	$('.cimg_ploja').html('<a href="#" data-theme="p" id="bt_pbaixo_loja"><img id="ci_ploja" src="imagens/forma_pagto.png" /></a>'); 
				    $(".c_loja").html(html1);
				    $(".c_loja").trigger('refresh'); 

				    if (sessionStorage.idreset == 2)
					{ 
				    	$(".cimg_reset").html('<a href="#" data-theme="p" id="bt_reset"><img id="ci_ploja" src="imagens/reset_28p.png" /></a>');
				    	$(".cimg_reset").trigger('create');
				    } else
				    {
				    	$(".cimg_reset").empty();
				    }
			    });
			}

			function painel_melhor(m_loja)
			{
				html3 = ''; html4 = '';
				loja = $.makeArray(JSON.parse(m_loja));
				html3 += 
				'<div class="mna_loja">'+
					'<div class="mlabel_loja">'+
						'Melhor Orçamento encontrado na<br/><b>'+loja[0].nome_fantasia+'</b>'+
					'</div>'+
					'<div class="mimg_ploja">'+
						'<a href="#" data-theme="p" id="bt_pbaixo_melhor"><img id="mi_ploja" src="imagens/forma_pagto.png" /></a>'+
					'</div>'+
				'</div>';
						
				html4 += 
				'<div class="mlabel_loja">'+
					'Distância: '+loja[0].distancia+'<br/>'+
					'Tempo Estimado: '+loja[0].duracao+'<br/>'+
					'Taxa de Entrega: '+loja[0].taxa_entrega+'<br/><br/>'+
					'<b>Aceitamos</b>'+
					'<div id="formas_pagto">';
								
					logo = sessionStorage.server+"/logos/fpagto/";
					fpagto = $.makeArray(JSON.parse(sessionStorage.formas_pagto));
					for (i=0; i < fpagto.length; i++)
					{
						html4 += '<div id="img_fpagto"><img src="'+logo+fpagto[i].logo+'" height="13.5" width="21" /></div>'+fpagto[i].descricao+'<br/>';
					}
					
					html4 += 
					'</div>'+
				'</div>';
					    
			    $(".m_loja").html(html3);
			    $(".m_loja").trigger('refresh'); 

			    $(".m_loja").on("click", "#bt_pbaixo_melhor", function()
				{ 
				    $(".m_loja").html(html3);
				    $(".m_loja").trigger('refresh'); 
			    	$('.mimg_ploja').html('<a href="#" data-theme="p" id="bt_pcima_melhor"><img id="mi_ploja" src="imagens/pcima_28cze.png" /></a>'); 
				    $('.mna_loja').append(html4);
			    });
	
			    $(".m_loja").on("click", "#bt_pcima_melhor", function()
				{ 
			    	$('.mimg_ploja').html('<a href="#" data-theme="p" id="bt_pbaixo_melhor"><img id="mi_ploja" src="imagens/forma_pagto.png" /></a>'); 
				    $(".m_loja").html(html3);
				    $(".m_loja").trigger('refresh'); 
			    });
			}
			