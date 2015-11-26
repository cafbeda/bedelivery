$("#acesso").on("pageinit", function() 
{
/*	v_w = screen.width;
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
	$("#be_in_logo").css("margin-left", sl);*/
	
	$("#acesso").on("click", ".bta_localize", function()
	{
		$(window.document.location).attr('href','localize.html');    		
	});
	
	$("#acesso").on("click", ".bta_endereco", function()
	{
		$(window.document.location).attr('href','endereco.html');    		
	});
	
	$("#acesso").on("click", ".bta_login", function()
	{
		$(window.document.location).attr('href','login.html');    		
	});
});
			