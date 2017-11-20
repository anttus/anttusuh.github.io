<?php
require "../login/loginheader.php";
require "../login/includes/dbconn.php";

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

?>
