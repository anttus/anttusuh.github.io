// Loading icon
document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'interactive') {
    document.getElementById('mainBody').style.visibility="hidden";
  } else if (state == 'complete') {
    setTimeout(function(){
      document.getElementById('interactive');
      document.getElementById('load').style.visibility="hidden";
      document.getElementById('mainBody').style.visibility="visible";
    },1300);
  }
}

function getDate() {
  var currentdate = new Date();
  var date = ('0' + currentdate.getDate()).slice(-2) + '.' +
  ('0' + (currentdate.getMonth()+1)).slice(-2)  + '.' +
  currentdate.getFullYear();
  return date;
}

function getTime() {
  var currentdate = new Date();
  var time =  + ('0' + currentdate.getHours()).slice(-2) + ":"
  + ('0' + currentdate.getMinutes()).slice(-2) + ":"
  + ('0' + currentdate.getSeconds()).slice(-2);
  return time;
}

function getCurUser() {
  var user = firebase.auth().currentUser;
  var uname, email, photoUrl, uid, emailVerified;

  if (user) {
    // Getting user's information
    if (user != null) {
      uname = user.displayName;
    }
  }
  return uname;
}

// BUTTONS
// "Tiskit tehty!" -button
const btnDish = document.getElementById('btnDish');
var cdBool = false;
btnDish.addEventListener('click', function () {
  if(!cdBool) {
    writeTask();
    cdBool = true;
    setTimeout(function() {
      cdBool = false;
      $('#dishSuccess').hide();
    }, 5000);
  }
  else {
    $('#dishSuccess').show();
  }
});

document.getElementById('btnGroup').addEventListener('click', function() {
  $.confirm({
    title: 'Prompt!',
    // content: '' +
    // '<form action="" class="formName">' +
    // '<div class="form-group">' +
    // '<label>Enter something here</label>' +
    // '<input type="text" placeholder="Your name" class="name form-control" required />' +
    // '</div>' +
    // '</form>',
    // buttons: {
    //   formSubmit: {
    //     text: 'Submit',
    //     btnClass: 'btn-blue',
    //     action: function () {
    //       var name = this.$content.find('.name').val();
    //       if(!name){
    //         $.alert('provide a valid name');
    //         return false;
    //       }
    //       $.alert('Your name is ' + name);
    //     }
    //   },
    //   cancel: function () {
    //     //close
    //   },
    // },
    // onContentReady: function () {
    //   // bind to events
    //   var jc = this;
    //   this.$content.find('form').on('submit', function (e) {
    //     // if the user submits the form by pressing enter in the field.
    //     e.preventDefault();
    //     jc.$$formSubmit.trigger('click'); // reference the button and click it
    //   });
    // }
  });
});

//function setProfImg()

// ANALYTICS
// function getCount(name) {
//   var result = null;
//   var scriptUrl = "php/getCount.php?name=" + name;
//   $.ajax({
//     url: scriptUrl,
//     type: 'get',
//     dataType: 'html',
//     async: false,
//     success: function(data) {
//       result = data;
//     }
//   });
//   return result;
// }

// Get usernames and calculate the precentage of entries/user
// function getUsernames() {
//     $.ajax({
//         type: 'POST',
//         url: 'php/getUsernames.php',
//         data: 'id=testdata',
//         dataType: 'json',
//         cache: false,
//         success: function(names) {
//           var arrLen = Object.keys(names).length;
//           var counts = new Array(arrLen);
//           var percents = new Array(arrLen);
//           var total = 0;
//           for (var i = 0; i < arrLen; i++) {
//             counts[i] = parseFloat(getCount(names[i]));
//             total += counts[i];
//           }
//           for (var i = 0; i < arrLen; i++) {
//             percents[i] = (counts[i] / total * 100.0).toFixed(2);
//           }
//           for (var i = 0; i < arrLen; i++) {
//             $('#scoreCount').append(names[i] + " - " + getCount(names[i]) + "(" + percents[i] + "%)<br/>");
//           }
//         },
//     });
// };

// // Dropdown menu
// function dropdown() {
//   $('.dropdown').on('show.bs.dropdown', function() {
//     $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
//   });
// }
//
// function dropdownUp() {
//   $('.dropdown').on('hide.bs.dropdown', function() {
//     $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
//   });
// }
//
// function play() {
//   $(document).ready(function() {
//     $("#audio").get(0).play();
//   });
// }
