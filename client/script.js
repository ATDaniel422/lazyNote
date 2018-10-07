const record_button = document.getElementById("record_button");
const stop_button = document.getElementById("stop_button");
const recording_text = document.getElementById("recording_text");
const recording_animation = document.getElementById("recording_animation");
const submit_button = document.getElementById("submit_button");
const email_bar = document.getElementById("email");

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

function enter_post_malone() {
    if (bar.value ==="") {
        alert("Plese enter an email");
    }
    if (bar.value != "" && event.which === 13) {
        post_malone();
    }
}

function post_malone() {
    var api_gateway_url = "https://aowdnbqwre.execute-api.us-east-1.amazonaws.com/alpha/execution"
    var email_input = document.getElementById("email_bar").value
    var rand = Math.random().toString().replace('0.', '');
    var prefix = email_input.split('@')[0] + rand;
    var prefix = prefix.toLowerCase();
    var input = `{"email": "${email_input}", "prefix": "${prefix}"}`
    var data_to_send = {"input":input,
                         "stateMachineArn":"arn:aws:states:us-east-1:477650777108:stateMachine:Lazy_Note_Pipeline"}
    var sendable_json = JSON.stringify(data_to_send)
    $.ajax({
        url: api_gateway_url,
        type: "POST",
        data: sendable_json,
        crossDomain: true,
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            data = [data, 'Your lazyNote text is being processed =)']
            alert(JSON.stringify(data[1]));
        },
        error: function(e) {
            alert("failed" + JSON.stringify(e));
        }
    });
}


record_button.addEventListener("click", start_recording);
stop_button.addEventListener("click", stop_recording);
submit_button.addEventListener("click", post_malone);
email_bar.addEventListener("keypress", enter_post_malone);
