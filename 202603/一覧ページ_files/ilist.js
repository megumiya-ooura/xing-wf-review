$(function() {

  $('.ilistthumb li').on('click', function(e){
//alert($(this).children('img').attr('src'));
//alert($(this).parent().parent().children('figure').children('img').attr('src'));

    $(this).parent().parent().children('figure').children('img').attr('src', $(this).children('img').attr('src'));

    $(this).parent().parent().children('figure').children('img').stop();
    $(this).parent().parent().children('figure').children('img').fadeTo(0, 0).fadeTo(400, 1);

    e.stopPropagation();
    e.preventDefault();

  });


});
