from io import BytesIO
import boto3
import wave

AUDIO_BUCKET = "lazynote-audio"

def join_audio(event, context):
    #Set up S3 context
    s3 = boto3.resource('s3')
    audio_bucket = s3.Bucket(AUDIO_BUCKET)
    audio_bucket.Acl().put(ACL='public-read')
    bucket_prefix = event['prefix']
    audio_objects = audio_bucket.objects.filter(Prefix=bucket_prefix)

    #Create new in-memory IO object to write to.
    out_buf = BytesIO()
    out_wav = wave.open(out_buf, 'wb')

    #We need a special case for first iteration, so we're iterating manually
    i = audio_objects.__iter__()
    data = next(i).get()['Body']

    #First time through we need to set the WAV properties
    with wave.open(data, 'rb') as in_wav:
        out_wav.setnchannels(in_wav.getnchannels())
        out_wav.setframerate(in_wav.getframerate())
        out_wav.setsampwidth(in_wav.getsampwidth())
        out_wav.writeframes(in_wav.readframes(in_wav.getnframes()))

    #Do the rest of the iteration like normal
    for audio_object in i:
        data = audio_object.get()['Body']
        with wave.open(data, 'rb') as in_wav:
            out_wav.writeframes(in_wav.readframes(in_wav.getnframes()))

    #Wrap everything up, and send it off to S3
    out_wav.close()
    #Seek to the beginning of the file so read() reads it
    out_buf.seek(0)
    audio_bucket.upload_fileobj(out_buf, f"{bucket_prefix}.wav")
    out_buf.close()

    return event
