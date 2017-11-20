<?php
require "../login/loginheader.php";
require "../login/includes/dbconn.php";

  $sql = "SELECT distinct username FROM times";
  $result = $conn->query($sql);
  $items = array();

  if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        array_unshift($items,$row);
    }
    $result_array = Array();

    foreach($items as $item ) {
        $result_array[] = $item['username'];
    }
    $json_array = json_encode($result_array, JSON_FORCE_OBJECT);
    echo $json_array;

  } else {
    echo "0 results";
  }

?>
