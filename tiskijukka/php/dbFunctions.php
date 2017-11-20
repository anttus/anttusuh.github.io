<?php
require "../login/loginheader.php";
// include "login/loginheader.php";
$sessionuser = $_SESSION['username'];

  $username = "root";
  $password = "R00tman1";
  $dbname = "login";

  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);
  // Check connection
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

switch ($_GET['funct']) {
    case "sendToDb":
        sendToDb();
        break;
    case "getLatestTime":
        getLatestTime();
        break;
    case "getFromDb":
        getFromDb();
        break;
    case "getCount":
        getCount();
        break;
  }

function sendToDb() {
  $datetime = (isset($_POST['dateTime'])) ? $_POST['dateTime'] : "Site loaded";

  //Inserting datetime and username
  $sql1 = "INSERT INTO times (timestamp, username) VALUES ('$datetime', '$sessionuser')";

  if ($conn->query($sql1) === TRUE) {

  } else {
    echo "Error: " . $sql1 . "<br>" . $conn->error;
  }
}

function getLatestTime() {
  $sql = "SELECT timestamp, username FROM times ORDER BY id DESC LIMIT 0, 1";
  $result = $conn->query($sql);
  $items = array();

  if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        array_unshift($items,$row);
    }

    foreach($items as $item ) {
        echo $item["username"] . " - "  . $item["timestamp"];
    }
  } else {
    echo "0 results";
  }
}

function getFromDb() {
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
}

function getCount() {
  $name = $_GET["name"];
  if ($name != "") {
    $sql="SELECT username FROM times where username = '$name'";
  } else {
    $sql="SELECT username FROM times";
  }

  if ($result=mysqli_query($conn,$sql))
    {
      // Return the number of rows in result set
      $rowcount=mysqli_num_rows($result);
      $float = floatval($rowcount);
      echo $float . PHP_EOL;
      // echo $rowcount;
      // Free result set
      mysqli_free_result($result);
      }
}

  $conn->close();
?>
