if (sessionStorage.login_status > 0)
{
	login    = $.makeArray(JSON.parse(sessionStorage.cliente));
	endereco = $.makeArray(JSON.parse(sessionStorage.endereco));
	endereco = endereco[0].endereco+', '+endereco[0].numero+' '+endereco[0].complemento;
}

html = '';

if (sessionStorage.login_status > 0)
{
	html += 
	'<div class="vertical verover azul saudacao">'+
		'<div class="horizontal img_local"><img src="imagens/u_sem_foto.png" /></div>'+
		'<div class="horizontal nome">'+
			'<div class="vertical">Olá, <b>'+sessionStorage.nome_cliente+'</b></div>'+
			'<div class="vertical endereco">'+endereco+'</div>'+
		'</div>'+
	'</div>'+
	'<div class="vertical menu_itens">'+	
	'<div class="vertical verover">'+
		'<div class="horizontal img_meumenu"><img src="imagens/u_sem_foto_20.png" /></div>'+
		'<div class="horizontal"><a href="#" id="bm_cadastro" class="bm_menu_itens" data-role="none">Meu Cadastro</a></div>'+
	'</div>'+
	'<div class="vertical verover">'+
		'<div class="horizontal img_meumenu"><img src="imagens/local_20.png" /></div>'+
		'<div class="horizontal"><a href="#" id="bm_endereco" class="bm_menu_itens" data-role="none">Meus Endereços</a></div>'+
	'</div>'+
	'<div class="vertical verover">'+
		'<div class="horizontal img_meumenu"><img src="imagens/pedidos_20.png" /></div>'+
		'<div class="horizontal"><a href="#" id="bm_pedidos" class="bm_menu_itens" data-role="none">Meus Pedidos</a></div>'+
	'</div>'+
	'<div class="vertical menu_linha"></div>'+	
	'<div class="vertical verover">'+
		'<div class="horizontal img_meumenu"><img src="imagens/lojas_20.png" /></div>'+
		'<div class="horizontal"><a href="#" id="bm_sglojas" class="bm_menu_itens" data-role="none">Sugira uma Loja</a></div>'+
	'</div>';
} else
{
	html += 
	'<div class="vertical verover azul saudacao">'+
		'<div class="horizontal logo"><img src="imagens/bedelivery_128.png" /></div>'+
	'</div>'+
	'<div class="vertical menu_itens">';
}

html += 
	'<div class="vertical verover">'+
		'<div class="horizontal img_meumenu"><img src="imagens/cofunc_20.png" /></div>'+
		'<div class="horizontal"><a href="#" id="bm_cofunc" class="bm_menu_itens" data-role="none">Como Funciona</a></div>'+
	'</div>'+
	'<div class="vertical verover">'+
		'<div class="horizontal img_meumenu"><img src="imagens/fale_20.png" /></div>'+
		'<div class="horizontal"><a href="#" id="bm_fale" class="bm_menu_itens" data-role="none">Fale Conosco</a></div>'+
	'</div>'+
	'<div class="vertical verover">'+
		'<div class="horizontal img_meumenu"><img src="imagens/moto_20.png" /></div>'+
		'<div class="horizontal"><a href="#" id="bm_sobre" class="bm_menu_itens" data-role="none">Sobre o BeDelivery</a></div>'+
	'</div>'+
	'<div class="vertical menu_linha"></div>'+	
	'<div class="vertical verover">'+
		'<div class="horizontal img_meumenu"><img src="imagens/sair_20.png" /></div>'+
		'<div class="horizontal"><a href="#" id="bm_sair" class="bm_menu_itens" data-role="none">Sair</a></div>'+
	'</div>'+
'</div>'+
'';

$("#painel").html(html);
$("#painel").trigger('create'); 

$("#painel").on("click", "#bm_cadastro", function()
{ $(window.document.location).attr('href','cadastro.html') }); 
$("#painel").on("click", "#bm_sair", function()
{ navigator.app.exitApp(); }); 
