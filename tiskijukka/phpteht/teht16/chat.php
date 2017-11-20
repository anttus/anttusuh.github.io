<?php
include("Model.php");
include("Controller.php");

$controller = new Controller();
if (isset($_GET["action"])) {
    $action = $_GET["action"];
} else {
    $action = "list_it";
}
$controller->$action();
?>