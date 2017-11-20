<?php
require "../login/loginheader.php";
require "../login/includes/dbconn.php";

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

?>
