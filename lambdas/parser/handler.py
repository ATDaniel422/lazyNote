import json
import boto3
import botocore
def index_in_list(list, elem):
    for i in list:
        if elem in i:
            return(list.index(i))


def parser(event, context):
    json_name = event["job_name"] + ".json"

    s3 = boto3.resource('s3')
    bucket = s3.Bucket("lazynote-audio")
    data = bucket.Object(json_name).get()['Body'].read().decode('utf-8')
    #concat_json = s3.get_object(Bucket='lazynote-audio',
    #                     Key= json_name)

    #extract_json = concat_json.get()['Body'].read().decode('utf-8')
    return_json = json.loads(data)

    num_speakers = return_json["results"]["speaker_labels"]["speakers"]
    items = return_json["results"]["items"]
    segments = return_json["results"]["speaker_labels"]["segments"]

    notes_txt = open("./notes.txt", "w")
    speaker_start_times = []
    for i in range(num_speakers):
        speaker_start_times.append([])

    for segment in segments:
        speaker_index = segment["speaker_label"][4:]
        for item in segment["items"]:
            start_time = item["start_time"]
            speaker_start_times[int(float(speaker_index))].append(start_time)

    cur_speaker = 0
    notes_txt.write("Person " + str(cur_speaker + 1) + ": ")
    for item in items:
        if(item["alternatives"][0]["confidence"] != None):
            speaker = index_in_list(speaker_start_times, item["start_time"])
            if(speaker != cur_speaker):
                cur_speaker = speaker
                notes_txt.write("\n\n")
                notes_txt.write("Person " + str(cur_speaker + 1) + ": ")
            notes_txt.write(item["alternatives"][0]["content"] + " ")
        #else:
            #notes_txt.write(item["alternatives"][0]["content"])

    notes_txt.close()

    bucket = "lazynote-audio"
    s3.Bucket(bucket).upload_file("./notes.txt", event["prefix"] + ".txt")

    event["output_uri"] = "http://s3.amazonaws.com/lazynote-audio/" + event["prefix"] + ".txt"

    return event
