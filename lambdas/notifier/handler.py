import json
import smtplib
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def sms_notifier(event, context):

    # for debugging the state machine
    print(event)

    destination_email = event['email']

    failure = False
    try:
        event['output_uri']
    except:
        failure = True
    
    username = "lazynote.mailer@gmail.com"
    password = "lazynote!"
    subject = "You LazyNote text is ready!"

    if failure == False:
        object_link = event['output_uri']
        success_message = f'''Your LazyNote text is finished. Please click the link to download!

        {object_link}

        Thank you for using LazyNote!
        '''

    failure_message = f'''We're so sorry, but something seems to have gone wrong. Your data request could not be completed. We apologize and thank you for your patience.

    Thank you for using LazyNote
    '''

    # Start email server
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    server.starttls()
    server.login(username, password)

    # Create and send email
    msg = MIMEMultipart()
    msg['From'] = username
    msg['To'] = destination_email
    msg['Subject'] = subject
    
    if failure == False:
        msg.attach(MIMEText(success_message, 'plain'))
    else:
        msg.attach(MIMEText(failure_message, 'plain'))
    body = msg.as_string()
    server.sendmail(username, destination_email, body)


    response = {
        "statusCode": 200
    }

    return response
