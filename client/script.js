var mediaConstraints = {
    audio: true
};

navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

function onMediaSuccess(stream) {
    window.mediaRecorder = new MediaStreamRecorder(stream);
    window.mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
    window.random_id = Math.random().toString(36).substring(8);
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
        url: "https://s3.amazonaws.com/lazynote-audio/" + window.random_id + "/" + d.toISOString() + ".wav",
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

function onMediaError(e) {
    console.error('media error', e);
}

function stopReqording(e) {
    window.mediaRecorder.stop();
    send_s3(new Blob(window.blobs()));
}
