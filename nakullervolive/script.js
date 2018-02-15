window.onload = function() {
  let video = document.getElementById("video");
  let randNum = Math.random() * video.duration;
  video.currentTime = randNum;
  video.play();
}
