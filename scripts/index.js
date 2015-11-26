			$("#index").on("pagecreate", function() 
			{
				// STORAGE //
				//sessionStorage.server = "http://192.168.25.112/bedelivery2";
				sessionStorage.server = "http://www.bedelivery.com.br";
				
				if (localStorage.lembrar == undefined) 
				{ localStorage.lembrar = 0; }

				if (localStorage.lembrar == 0)
				{
					localStorage.login = '';
					localStorage.senha = '';
				}
				
				sessionStorage.cliente = '';
				sessionStorage.nome_cliente = '';
				sessionStorage.login_status = 0;
				sessionStorage.detalhe = 1;
				sessionStorage.melhor = '';
				sessionStorage.melhor_pagto = '';
				sessionStorage.endereco = '';
				sessionStorage.gps = '';
				sessionStorage.loja = '';
				sessionStorage.formas_pagto = '';
				sessionStorage.idempresa = '';
				sessionStorage.idreset = 1;
				sessionStorage.texto_pesquisa = '';
				sessionStorage.ordem = '';
				sessionStorage.filtros = '';
				
				v_w = screen.width;
				v_h = screen.height;
				
				if (v_w >= v_h)
				{ 
					v_h = screen.height*70/100;
					v_t = (screen.height*15/100)/2;
					v_l = (screen.width-v_h)/2.5;
				} else
				{ 
					v_h = screen.width*70/100;
					v_t = (screen.height-v_h)/3;
					v_l = (screen.width-v_h)/3;
				}

				sw = v_h.toString()+"px";
				st = v_t.toString()+"px";
				sl = v_l.toString()+"px";
				$("#be_in_logo").css("width", sw);
				$("#be_in_logo").css("margin-top", st);
				$("#be_in_logo").css("margin-left", sl);
				
				$.ajax(
				{
					type: "GET",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					async: "true",
					url: sessionStorage.server+"/wolke/wolke.php?JOB=login&MTD=weas",
					data: null,
					success: function(msg) 
					{
					    jsonArray = $.makeArray(msg);
					},
					complete: function()
					{
						if (jsonArray[0] == 1)
						{
							var db = openDatabase("bedelivery", "1.0", "bedelivery", 200000);
			    			db.transaction(createDBa, errorDBa, successDBa);
			    			
			    			function createDBa(txa)
			    			{
								sql = 'drop table if exists carrinho';
			    				txa.executeSql(sql);
			    			}
			    			
			    			function successDBa()
			    			{
			        			db.transaction(createDBb, errorDBb, successDBb);
			        			
			        			function createDBb(txb)
			        			{
			        				sql = 'create table if not exists carrinho'+
			        				'(codebar varchar(50),idempresa integer, idgrupo integer, quantidade integer, fracao float, estoque float, '+
			        				'reserva float, descricao varchar(200),complemento varchar(300),apresentacao varchar(200), unidade varchar(20), '+
			        				'nome_fantasia varchar(150), fornecedor varchar(100), preco_promo float, preco_venda float, '+
			        				'imagem varchar(100),codigo_referencia varchar(20))';
			        				txb.executeSql(sql);
			        			}
			        			
			        			function successDBb()
			        			{
			    					$(window.document.location).attr('href','acesso.html');    		
			        			}
			        			
			        			function errorDBb()
			        			{
			    	    			alert('Erro [02] na Inicialização do BeDelivery');		
			        			}
			    			}
			    			
			    			function errorDBa()
			    			{
				    			alert('Erro [01] na Inicialização do BeDelivery');		
			    			}
						} else
						{
							alert("WOLKE: BeDelivery não está Disponível");
						}
					},
					error: function(msg) 
					{ alert("WOLKE: Erro no acesso ao serviço"); }
				});
    		});
    		
