<?php
require "login/loginheader.php";
// include "../login/includes/dbconn.php";

$servername = "localhost";
$username = "root";
$password = "R00tman1";
$dbname = "login";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

  $sql = "SELECT timestamp, username FROM times";
  $result = $conn->query($sql);
  $items = array();

  if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        array_unshift($items,$row);
    }

    foreach($items as $item ) {
        echo   $item["username"] . " - " . $item["timestamp"] . "<p></p>";
    }
  } else {
    echo "0 results";
  }

?>
