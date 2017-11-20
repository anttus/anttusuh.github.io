<?php
session_start();
if (isset($_SESSION['username'])) {
  header("location:../index.php");
}
$_SESSION["fadeAlertCount"] = 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="utf-8">
  <title>Kirjaudu - Tiskijukka</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Bootstrap -->
  <link href="../css/bootstrap.css" rel="stylesheet" media="screen">
  <link href="../css/main.css" rel="stylesheet" media="screen">

  <!-- ICONS -->
  <link rel="apple-touch-icon" sizes="57x57" href="../ico/apple-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="../ico/apple-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="76x76" href="../ico/apple-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="72x72" href="../ico/apple-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="114x114" href="../ico/apple-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="../ico/apple-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="../ico/apple-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="../ico/apple-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="../ico/apple-icon-180x180.png">
  <link rel="icon" type="image/png" sizes="192x192"  href="../ico/android-icon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="../ico/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="../ico/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="16x16" href="../ico/favicon-16x16.png">
  <link rel="manifest" href="../ico/manifest.json">
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta name="msapplication-TileImage" content="../ico/ms-icon-144x144.png">
  <meta name="theme-color" content="#ffffff">

</head>
<body>
  <div class="container">
    <h1>Tiskijukka</h1>
    <form class="form-signin" name="form1" method="post" action="checklogin.php">

      <!-- <img src="../img/Tiskijukka_logo.png" > -->
      <h2 class="form-signin-heading">Tervetuloa Tiskijukkaan!</h2>
      <input name="myusername" id="myusername" type="text" class="form-control" placeholder="Username" autofocus>
      <input name="mypassword" id="mypassword" type="password" class="form-control" placeholder="Password">
      <!-- The checkbox remember me is not implemented yet...
      <label class="checkbox">
      <input type="checkbox" value="remember-me"> Remember me
    </label>
  -->
  <button name="Submit" id="submit" class="btn btn-lg btn-primary btn-block" type="submit">Kirjaudu</button>
  <a href="signup.php" name="Sign Up" id="signup" class="btn btn-lg btn-primary btn-block" type="submit">Luo uusi käyttäjätunnus</a>

  <div id="message"></div>

</form>

</div> <!-- /container -->

<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="js/jquery-2.2.4.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script type="text/javascript" src="js/bootstrap.js"></script>
<!-- The AJAX login script -->
<script src="js/login.js"></script>

</body>
</html>
