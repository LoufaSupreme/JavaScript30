// elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// functions
function togglePlay() {
    video.paused ? video.play() : video.pause();
}

function updatePlayBtn() {
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.innerHTML = icon;
}

function skip() {
    video.currentTime += parseFloat(this.dataset.skip); // must parseFloat since currentTime is a float
}

function rangeChange() {
    
    // if (this.name === 'volume') {
    //     video.volume = this.value;
    // }
    // else if (this.name === 'playbackRate') {
    //     video.playbackRate = this.value;
    // }
    video[this.name] = this.value; // the above is more intuitive.  This line works instead b/c the names of the ranges are the same as the video properties (volume, playbackRate)
}

function updateProgress() {
    const percentComplete = video.currentTime / video.duration * 100;
    progressBar.style.flexBasis = `${percentComplete}%`;
}

function scrubVideo(e) {
    let targetTime = parseFloat(e.offsetX / progress.offsetWidth * video.duration);
    video.currentTime = targetTime;
    // e.offsetX is the x pos of the mouse relative to the start of the progress bar
    // this.offsetWidth is the width (in pixels) of the progress bar

}

// event listeners
toggle.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);

video.addEventListener('play', updatePlayBtn);
video.addEventListener('pause', updatePlayBtn);

skipButtons.forEach(btn => btn.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', rangeChange));

video.addEventListener('timeupdate', updateProgress);

let mouseDown = false;
progress.addEventListener('click', scrubVideo);
progress.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        scrubVideo(e);
    }
});
progress.addEventListener('mousedown', () => mouseDown = true);
progress.addEventListener('mouseup', () => mouseDown = false);