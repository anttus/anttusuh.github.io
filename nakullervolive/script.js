window.onload = function() {
  let video = document.getElementById("video");
  let randNum = Math.random() * video.duration;
  video.load();
  video.addEventListener('loadeddata', function() {
    this.currentTime = parseInt(randNum);
    this.play();
  }, false);
}
