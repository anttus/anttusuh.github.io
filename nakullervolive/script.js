window.onload = function() {
  let video = document.getElementById("video");
  let randNum = parseInt(Math.random() * video.duration);
  video.load();
  video.addEventListener('loadeddata', function() {
    this.currentTime = randNum;
    this.play();
  }, false);
}
