import json
import boto3

def index_in_list(list, elem):
    for i in list:
        if elem in i:
            return(list.index(i))


def parser(event, context):
    translate = boto3.client(service_name='translate')

    num_speakers = event["return_json"]["results"]["speaker_labels"]["speakers"]
    items = event["return_json"]["results"]["items"]
    segments = event["return_json"]["results"]["speaker_labels"]["segments"]
    
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

    notes_txt.close()

    with open("./notes.txt") as f:
        content = f.readlines()
    content = [x.strip() for x in content]

    translated_text = open("./translated_text.txt", "w")
    for line in content:
        if(len(line) > 10):
            result = translate.translate_text(Text=str(line), SourceLanguageCode="en", TargetLanguageCode="es")
            translated_text.write(result.get('TranslatedText') + "\n\n")

    
    s3 = boto3.resource("s3")
    bucket = "lazynote-audio"
    s3.Bucket(bucket).upload_file("./notes.txt", event["prefix"] + ".txt")

    event["output_uri"] = "http://s3.amazonaws.com/lazynote-audio/" + event["prefix"] + ".txt"

#    return event