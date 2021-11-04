
const buttons = document.querySelectorAll('button');

const backTime = document.querySelector('.display__end-time');
const timeLeft = document.querySelector('.display__time-left');

// global variable that holds a timers interval:
// important that it's global so that clearInterval can be called at the beginning of a new timer.
let countdown;

function timer(seconds) {

    if (Number.isNaN(seconds)) {
        backTime.textContent = "That's not a number...";
        return;
    }
    // clear any existing timers:
    clearInterval(countdown);
    

    // note that it's important to calculate the target time once at the start of the function, and reference it in the setInterval, rather than recalculating it inside the setInterval.  This is b/c the browser will pause intervals if the user navigates away (and on mobile, it is paused when the user is scrolling):
    const now = Date.now(); // ms
    const then = now + seconds * 1000; // ms

    // display the timer:
    displayTimeLeft(seconds);
    // display the end time:
    displayEndTime(then);

    // inside the interval, calculate the amount of time left from the pre-calculated target time ('then') to now.  This way even if the interval gets temporarily interrupted somehow, it will still be correct when it resumes:
    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);

        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
    
        displayTimeLeft(secondsLeft);

    }, 1000);
}

function displayTimeLeft(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const display = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    timeLeft.textContent = display;
    document.title = display;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    backTime.textContent = `Be back at ${end.getHours() > 12 ? end.getHours()-12 : end.getHours()}:${end.getMinutes() < 10 ? '0' : ''}${end.getMinutes()}`;
}

function startTimer() {
    const seconds = this.dataset.time;
    timer(seconds);
}


buttons.forEach(btn => btn.addEventListener('click', startTimer));
// note that we don't have to queryselect the form element... we can access it directly by it's "name" set in the HTML.  Same goes for any elements that are named (like the input within this form):
document.customForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const mins = parseInt(this.minutes.value);
    timer(mins * 60);
    this.reset();
})
