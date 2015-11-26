	html = '';

	html += 
	'<fieldset data-role="controlgroup" data-theme="p" data-mini="true">'+
		'<input type="radio" name="f_ordenar" id="DESA" value="DESA" /><label for="DESA">Descrição A-Z</label>'+
		'<input type="radio" name="f_ordenar" id="DESD" value="DESD" /><label for="DESD">Descrição Z-A</label>'+
		'<input type="radio" name="f_ordenar" id="MENP" value="MENP" /><label for="MENP">Menor Preço</label>'+
		'<input type="radio" name="f_ordenar" id="MAIP" value="MAIP" /><label for="MAIP">Maior Preço</label>'+
		'<input type="radio" name="f_ordenar" id="FABA" value="FABA" /><label for="FABA">Fabricante A-Z</label>'+
		'<input type="radio" name="f_ordenar" id="FABD" value="FABD" /><label for="FABD">Fabricante Z-A</label>';
			
		if (sessionStorage.idempresa == '')
		{ 
			html += 
			'<input type="radio" name="f_ordenar" id="LOJA" value="LOJA" /><label for="LOJA">Loja A-Z</label>'+
			'<input type="radio" name="f_ordenar" id="LOJD" value="LOJD" /><label for="LOJD">Loja Z-A</label>';
		}
	'</fieldset>';
		
	$(".f_ordem").html(html);
	$(".f_ordem").trigger('create'); 
	
	$("#filtro").on("panelbeforeopen", function()
	{
		$("#filtro").trigger('updatelayout');
	});	

	$("#filtro").on("panelbeforeclose", function()
	{
		var fs_loja = new Array();

		$("fieldset#fs_loja input:checked").each(function()
		{
			fs_loja.push($(this).val());
		});

    	f_itens = [];
    	for(i=0; i < fs_loja.length; i++)
    	{
    		itens = {};
    		item = fs_loja[i].split(";");
    				
    		if (item[0] == "1")
    		{ itens.cs = item[1]; } 
    		if (item[0] == "2")
    		{ itens.ce = item[1]; } 
    		if (item[0] == "2")
    		{ itens.ce = item[1]; } 
    		f_itens.push(itens);
    	}							
    	
		var fs_fabr = new Array();

		$("fieldset#fs_fabr input:checked").each(function()
		{
			fs_fabr.push($(this).val());
		});

    	for(i=0; i < fs_fabr.length; i++)
    	{
    		itens = {};
    		itens.cf = fs_fabr[i];
    		f_itens.push(itens);
    	}							

    	sessionStorage.filtros = JSON.stringify(f_itens);
    	//popup_ok(sessionStorage.filtros);
    	
    	if (sessionStorage.filtros != '')
		{ pesquisa_produtos(); }
	});	

function carrega_filtros()
{
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
		url:  sessionStorage.server+"/wolke/wolke.php?JOB=filtro&MTD=filtro_app",
		data: 'loja='+sessionStorage.idempresa+'&pesquisa='+pesquisa+'&endereco='+endereco[0].idenderecos,
		success: function(msg) 
		{
			filtroArray = $.makeArray(msg);
		},
		complete: function()
		{
			if (filtroArray.length > 0)
			{
				html_s = ''; html_e = ''; html_f = '';
				
			  	for(i=0; i < filtroArray.length; i++)
			   	{
					if (filtroArray[i].reg == "1")
					{
				  		html_s += '<input type="checkbox" name="f_loja" id="1;'+filtroArray[i].ide+'" value="1;'+filtroArray[i].ide+'" /><label for="1;'+filtroArray[i].ide+'">'+filtroArray[i].des+'</label>';
					}

					if (filtroArray[i].reg == "2")
					{
				  		html_s += '<input type="checkbox" name="f_loja" id="2;'+filtroArray[i].ide+'" value="2;'+filtroArray[i].ide+'" /><label for="2;'+filtroArray[i].ide+'">'+filtroArray[i].des+'</label>';
					}

					if (filtroArray[i].reg == "3")
					{
				  		html_f += '<input type="checkbox" name="f_fabr" id="'+filtroArray[i].des+'" value="'+filtroArray[i].des+'" /><label for="'+filtroArray[i].des+'">'+filtroArray[i].des+'</label>';
					}
			   	}
			  	
			  	html_s = '<fieldset data-role="controlgroup" id="fs_loja" data-theme="p" data-mini="true">'+html_s+'</fieldset>';
			  	html_f = '<fieldset data-role="controlgroup" id="fs_fabr" data-theme="p" data-mini="true">'+html_f+'</fieldset>';

				$(".f_loja").html(html_s);
				$(".f_loja").trigger('create'); 
				$(".f_fabricante").html(html_f);
				$(".f_fabricante").trigger('create'); 
				
				if (sessionStorage.filtros != '')
				{
					filtros = $.makeArray(JSON.parse(sessionStorage.filtros));
					
					for(i=0; i < filtros.length; i++)
			    	{
			    		if (Object.keys(filtros[i]) == "cs")
			    		{ k_filtro = "#1;"+filtros[i].cs.toString(); }
			    		if (Object.keys(filtros[i]) == "ce")
			    		{ k_filtro = "#2;"+filtros[i].ce.toString(); }
			    		if (Object.keys(filtros[i]) == "cf")
			    		{ k_filtro = "#"+filtros[i].cf; }

			    		//popup_ok(k_filtro);
			    		$(k_filtro).prop('checked', true);
			    	}
				}
				
			} else
			{ 
			}
						    	
			$.mobile.loading('hide');
		},
		error: function(msg) 
		{ popup_ok("FILTRO: Erro na pesquisa de dados"); }
	});
}
