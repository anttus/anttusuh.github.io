window.onload = function() {
  let video = document.getElementById("video");
  let randNum = Math.random() * video.duration;
  video.load();
  video.currentTime = parseInt(randNum);
  video.addEventListener('loadeddata', function() {
    video.play();
  }, false);
}
