<?php
require "../login/loginheader.php";
require "../login/includes/dbconn.php";

$sessionuser = $_SESSION['username'];

  $datetime = (isset($_POST['dateTime'])) ? $_POST['dateTime'] : "Site loaded";

  //Inserting datetime and username
  $sql1 = "INSERT INTO times (timestamp, username) VALUES ('$datetime', '$sessionuser')";

  if ($conn->query($sql1) === TRUE) {

  } else {
    echo "Error: " . $sql1 . "<br>" . $conn->error;
  }

?>
