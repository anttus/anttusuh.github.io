window.onload = function() {
  let video = document.getElementById("video");
  let randNum = Math.random() * video.duration;
  video.currentTime = parseInt(randNum);
  video.play();
}
