const record_button = getElementById("record_button");
const stop_button = getElementById("stop_button");
const recording_text = getElementById("recording_text");
const recording_animation = getElementById("recording_animation");

var now_recording = false;

function start_recording() {
    if now_recording === true {
        continue;
    }
    else {
        recording_text.toggle(hidden);

    }
}


record_button.addEventListener("click", start_recording);
stop_button.addEventListener("click", stop_recording);
