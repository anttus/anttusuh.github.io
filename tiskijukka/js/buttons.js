// BUTTONS

const btnDish = document.getElementById('btnDish');
var cdBool = false;
btnDish.addEventListener('click', function () {
  if(!cdBool) {
    writeTask(document.getElementById('dropdownDish').value);
    cdBool = true;
    setTimeout(function() {
      cdBool = false;
      $('#dishSuccess').hide();
    }, 3000);
  }
  else {
    $('#dishSuccess').show();
  }
});

$('#scoreButton').click(function() {
  if ($('#scoreCountList').is(":hidden")) {
    $('#scoreCountList').slideDown("fast");
    $('#scoreButton').removeClass('glyphicon-chevron-down');
    $('#scoreButton').addClass('glyphicon-chevron-up');
  } else {
    $('#scoreCountList').slideUp("fast");
    $('#scoreButton').addClass('glyphicon-chevron-down');
    $('#scoreButton').removeClass('glyphicon-chevron-up');
  }
});

$('#showMoreButton').click(function() {
  if ($('#task p:gt(9)').is(":hidden")) {
    $('#task > p').slideDown("fast");
    $('#showMoreButton').removeClass('glyphicon-chevron-down');
    $('#showMoreButton').addClass('glyphicon-chevron-up');
  } else {
    $('#task p:gt(9)').slideUp("fast");
    $('#showMoreButton').removeClass('glyphicon-chevron-up');
    $('#showMoreButton').addClass('glyphicon-chevron-down');
  }
});

$('#btnProfile').click(function() {
  
});
