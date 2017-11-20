<?php
    $text = "20.5testing";
    $number = 0;
    $f_number = 3.14;
    $number = $number + $text;
    $f_number = $f_number + $text;
    echo  "Values ".  $number . " and " . $f_number . "\n";
    
    //Array test
    $arr = array("String1", "String2", "String3", "String4", "String5");
    foreach ($arr as $value) {
        echo $value . "\n";
    }
    
    //Calculate area of a circle
    $radius = 3;
    $area = pi() * ($radius * $radius);
    echo "\nArea of the circle: " . $area . "\n";
?>