const record_button = document.getElementById("record_button");
const stop_button = document.getElementById("stop_button");
const recording_text = document.getElementById("recording_text");
const recording_animation = document.getElementById("recording_animation");
const submit_button = document.getElementById("submit_button");
const email_bar = document.getElementById("email");

function start_recording() {
    if (recording_animation.style.animationPlayState != "running") {
        navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
        recording_animation.style.animationPlayState = "running";
        recording_text.toggleAttribute('hidden');
    }
}

function stop_recording() {
    if (recording_animation.style.animationPlayState == "running") {
        window.mediaRecorder.stop();
        send_s3(new Blob(window.blobs));
        recording_animation.style.animationPlayState = "paused";
        recording_text.toggleAttribute('hidden');
    }
}

function enter_post_malone() {
    if (email_bar.value ==="") {
        alert("Plese enter an email");
    }
    if (email_bar.value != "" && event.which === 13) {
        post_malone();
    }
}

function post_malone() {
    var prefix = window.prefix
    var api_gateway_url = "https://aowdnbqwre.execute-api.us-east-1.amazonaws.com/alpha/execution"
    var email_input = email_bar.value
    var input = {"email": email_input, "prefix": prefix}
    var data_to_send = {"input":JSON.stringify(input),
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

var mediaConstraints = {
    audio: true
};

function onMediaSuccess(stream) {
    window.mediaRecorder = new MediaStreamRecorder(stream);
    window.mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
    window.prefix = Math.random().toString(36).substring(12);
    window.blobs = [];
    window.num = 0;
    mediaRecorder.ondataavailable = function (blob) {
        // POST/PUT "Blob" using FormData/XHR2
        window.blobs.push(blob);
        if(window.blobs.length > 10) {
            num++;
            sendblob = new Blob(window.blobs);
            window.blobs = [];
            console.log(sendblob);
            send_s3(sendblob, num);
        }
    };
    window.mediaRecorder.start();
}

function send_s3(data) {
    d = new Date()
    $.ajax({
        url: "https://s3.amazonaws.com/lazynote-audio/" + window.prefix + "/" + d.toISOString() + ".wav",
        type: "PUT",
        data: data,
        beforeSend: function(req) {
            req.setRequestHeader("x-amz-acl", "bucket-owner-full-control");
        },
        processData: false,
        crossDomain: true,
        dataType: "json",
        contentType: "audio/x-wav",
        success: function(data) {
            data = [data, 'tada!']
            console.log(JSON.stringify(data));
        },
        error: function(e) {
            console.log("failed" + JSON.stringify(e));
        }
    });
}

record_button.addEventListener("click", start_recording);
stop_button.addEventListener("click", stop_recording);
submit_button.addEventListener("click", post_malone);
email_bar.addEventListener("keypress", enter_post_malone);

function onMediaError(e) {
    console.error('media error', e);
}
