$( document ).ready(function() {
	$('p.more').remove();
	$('.toplink').remove();
	$('a').attr('href', '#');

	$('.theme').each(function(){
		var nrTopics = $(this).find('li').length;
		var newIt = nrTopics/4;
		$(this).find('h3').append(newIt)
	});



	
});