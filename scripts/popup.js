function popup_ok(mensagem)
{
	html1 =
	'<div data-role="popup" id="popup" data-theme="p" class="ui-content" data-dismissible="false" data-position-to="window"></div>';

	html2 = 
	'<div>'+
		'<h3>'+mensagem+'</h3><br/>'+
		'<a href="#" class="ui-btn" id="popup_ok" data-role="button">OK</a>'+
	'</div>';
	
   	$("#popup").html(html2);
	$("#popup").popup("open");
	
	$("#popup").on("click", "#popup_ok", function()
	{ $("#popup").popup("close"); });
}

function popup_sn(titulo, mensagem)
{
	html1 =
	'<div data-role="popup" id="popup" data-theme="p" class="ui-content" data-dismissible="false" data-position-to="window"></div>';

	html2 = 
	'<div>'+
		'<h3>'+titulo+'</h3><br/>'+
		mensagem+'<br/>'+
		'<a href="#" data-role="button" class="ui-btn" id="popup_nao" data-inline="true">Não</a>'+
		'<a href="#" data-role="button" class="ui-btn" id="popup_sim" data-inline="true">Sim</a>'+
	'</div>';
	
   	$("#popup").html(html2);
	$("#popup").popup("open");
	
	$("#popup").on("click", function()
	{ $("#popup").popup("close"); });
}