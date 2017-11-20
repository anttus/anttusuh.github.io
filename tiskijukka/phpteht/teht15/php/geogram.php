<?php

// follow gethint.php
// get the q parameter from URL
//  $q = $_REQUEST["q"];
// change the following

if (!empty($_GET['location'])){

  /**
   * Here we build the url we'll be using to access the google maps api
   */

  $maps_url = 'https://'.
  'maps.googleapis.com/'.
  'maps/api/geocode/json'.
  '?address=' . urlencode($_GET['location']);
  $maps_json = file_get_contents($maps_url);
  $maps_array = json_decode($maps_json, true);
  $lat = $maps_array['results'][0]['geometry']['location']['lat'];
  $lng = $maps_array['results'][0]['geometry']['location']['lng'];
  echo "Location: " . $_GET['location'] . "</br>";
  echo "Latitude: " . $lat . "</br>" . "Longitude: " . $lng . "</br>";

  $sunset_url = 'https://' .
  'api.sunrise-sunset.org/' .
  'json?' .
  'lat=' . $lat . '&lng=' . $lng . '&date=today';
  $sunset_json = file_get_contents($sunset_url);
  $sunset_array = json_decode($sunset_json, true);
  $sunset = $sunset_array['results']['sunset'];
  $sunrise = $sunset_array['results']['sunrise'];
  $daylength = $sunset_array['results']['day_length'];
  echo "</br>Sunrise: " . $sunrise . "</br>";
  echo "Sunset: " . $sunset . "</br>";
  echo "Day length : " . $daylength . "</br>";

  /**
   * Time to make our Instagram api request. We'll build the url using the
   * coordinate values returned by the google maps api
   */

  // $instagram_url = 'https://'.
  //   'api.instagram.com/v1/media/search' .
  //   '?lat=' . $lat .
  //   '&lng=' . $lng .
  //   '&client_id=3865190006'; //replace "CLIENT-ID"
  // $instagram_json = file_get_contents($instagram_url);
  // $instagram_array = json_decode($instagram_json, true);
  //
  // if(!empty($instagram_array)){
  //   foreach($instagram_array['data'] as $key=>$image){
  //     echo "</br>" . '<img src="'.$image['images']['low_resolution']['url'].'" alt=""/><br/>';
  //   }
  // }
 // give it back to Javascript

}
?>
