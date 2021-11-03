// ---------------------- //
// GLOBAL VARIABLES
// ---------------------- //

const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// user selected filter option
let filter = null;

// ---------------------- //
// MAIN FUNCTIONS
// ---------------------- //


const getVideo = () => {
    // get video stream from webcam
    navigator.mediaDevices.getUserMedia( { video: true, audio: false }) // returns a promise
        .then(localMediaStream => {
            // console.log(localMediaStream);
            // put the media as a srcObject for the video dom element
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
        // get pixels
        let pixels = ctx.getImageData(0, 0, width, height); //returns an array of all the (r,g,b,a) values of each pixel. index 0 = first pixels r, 1 = first pixels g, 4 = second pixels r.
        //NOTE: you cant use array methods (map, filter, etc) on this type of array (Uint8ClampedArray)!
        
        // apply filter
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.1;
        // pixels = greenScreen(pixels);
        pixels = applyFilter(pixels);

        // put the updated pixels back into canvas
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    // take the image data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    // create an anchor link
    const link = document.createElement('a');
    // set the href to the data.  THis is just a stream of text representing an image, but the computer can actually recognize this and view it.  It's not technically a jpeg yet though.
    link.href = data;
    // set a download attribute that will allow the file to be downloaded as a jpeg
    link.setAttribute('download', 'handsome');
    // make an image
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    //insert the image in front of any old images
    strip.insertBefore(link, strip.firstChild);
}

// ---------------------- //
// FILTERS
// ---------------------- //

// changes the global "filter" var based on user pressed button
function changeFilter(name) {
    filter = name;
    if (name === 'greenScreen') {
        document.querySelector('.rgb').style.display = 'inline-block';
    }
    else {
        document.querySelector('.rgb').style.display = 'none';
    }
}

// modifies the pixels based on the chosen filter
function applyFilter(pixels) {
    if (filter === null) {
        ctx.globalAlpha = 1;
        return pixels;
    } 
    else if (filter === 'blur') {
        ctx.globalAlpha = 0.1;
        return pixels;
    }
    else if (filter === 'red') {
        ctx.globalAlpha = 1;
        return redEffect(pixels);
    }
    else if (filter === 'rgbSplit') {
        ctx.globalAlpha = 1;
        return rgbSplit(pixels);
    }
    else if (filter === 'greenScreen') {
        ctx.globalAlpha = 1;
        return greenScreen(pixels);
    }
    else {
        console.log('NO FILTER CHOSEN!');
    }
}

function redEffect(pixels) {
    // remember, can't use map or filter or higher order array functions on UInt8ClampedArrays
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] += 100 // red
        pixels.data[i+1] -= 50 // green
        pixels.data[i+2] *= 0.5 // blue
        // pixels.data[i+3]  // alpha
    }
    return pixels;
}

function rgbSplit(pixels) {
    // remember, can't use map or filter or higher order array functions on UInt8ClampedArrays
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i] // red
        pixels.data[i + 500] = pixels.data[i + 1]// green
        pixels.data[i + 550] = pixels.data[i + 2] // blue
        // pixels.data[i+3]  // alpha
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }
  

// ---------------------- //
// RUN on Load
// ---------------------- //

// get the video stream from the webcam
getVideo();

// paint to canvas as soon as the video is able to play
video.addEventListener('canplay', paintToCanvas);