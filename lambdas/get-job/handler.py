import json
import boto3
import botocore


def get_job(event, context):
    client = boto3.client('transcribe')
    job_name = event['job_name']
    status = client.get_transcription_job(
        TranscriptionJobName = job_name
    )
    job_status = status['TranscriptionJob']['TranscriptionJobStatus']

    event['job_status'] = job_status

    return event
