import json
import string
import time
import boto3
import botocore
import random


def start_transcription(event, context):
        transcibe = boto3.client('transcribe')
        x = autogen()
        email = event['email']
        email = email.split("@")
        job_name = email[0] + x
        prefix = event['prefix']
        job_name = f'start_{prefix}_job'
        transcibe.start_transcription_job( TranscriptionJobName= job_name,
        LanguageCode='en-US',
        MediaFormat= 'wav',
        Media={
            'MediaFileUri':
            f'https://s3-us-east-1-amazonaws.com/lazynote-audio/{prefix}.wav'
        },
        OutputBucketName='lazynote-audio',
        Settings={
            'ShowSpeakerLabels': True,
            'MaxSpeakerLabels': 8,
            'ChannelIdentification': False
        }
        )
        event['job_name'] = job_name
        return event

def autogen():
    x = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
    x = x.lower()
    return x
