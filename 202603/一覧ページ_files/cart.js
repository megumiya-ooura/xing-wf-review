
$(function() {


  $('.imgselect > article > div').click(function() {

    var target = $(this).parent().parent().parent().attr('id');

    $('#' + target + ' .imgselect > article > div').each(function() {
      $(this).removeClass('selected');
    });

    $(this).addClass('selected');

    $('[name="' + target + '"]').val($(this).children('font').text());

  });


  $('.imgselect > article > font').click(function() {

    $('#' + $(this).attr('id') + 'b').removeClass('hide');

  });

  $('.zbox').click(function() {

    $(this).addClass('hide');

  });

  $('.zbox > div > h6').click(function() {

    var target = $(this).parent().parent().parent().attr('id');

    $('#' + target + ' .imgselect > article > div').each(function() {
      $(this).removeClass('selected');
    });

    $sel = $(this).parent().parent().attr('id');

    $('#' + $sel.slice(0, $sel.length - 1) + 's').addClass('selected');

    $('[name="' + target + '"]').val($(this).parent().children('font').text());

    $(this).addClass('hide');

  });


});



/*


$(function() {


  $('.imgselect > div').click(function() {

//alert($(this).parent().parent().attr('id'));

    var target = $(this).parent().parent().attr('id');

    $('#' + target + ' .imgselect > div').each(function() {
      $(this).removeClass('selected');
    });

    $(this).addClass('selected');

    $('[name="' + target + '"]').val($(this).children('font').text());

  });


});

*/
