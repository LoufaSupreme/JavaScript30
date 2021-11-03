const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

const getVideo = () => {
    navigator.mediaDevices.getUserMedia( { video: true, audio: false }) // returns a promise
        .then(localMediaStream => {
            // console.log(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => console.log(err));
}

function paintToCanvas() {
    // get dimensions of video stream
    const width = video.videoWidth;
    const height = video.videoHeight;
    // set canvas to be same size as video stream
    canvas.width = width;
    canvas.height = height;

    // every 16ms, take a frame of video and paint it to canvas element
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
    }, 16);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    // take the image data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firstChild);
}

getVideo();

// paint to canvas as soon as the video is able to play
video.addEventListener('canplay', paintToCanvas);