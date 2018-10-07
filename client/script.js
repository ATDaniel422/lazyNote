const record_button = document.getElementById("record_button");
const stop_button = document.getElementById("stop_button");
const recording_text = document.getElementById("recording_text");
const recording_animation = document.getElementById("recording_animation");


function start_recording() {
    if (recording_animation.style.animationPlayState != "running") {
        recording_animation.style.animationPlayState = "running";
        recording_text.toggleAttribute('hidden');
    }
}

function stop_recording() {
    if (recording_animation.style.animationPlayState == "running") {
        recording_animation.style.animationPlayState = "paused";
        recording_text.toggleAttribute('hidden');
    }
}

record_button.addEventListener("click", start_recording);
stop_button.addEventListener("click", stop_recording);
