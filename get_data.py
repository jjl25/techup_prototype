import requests
from lxml import html
import re
from datetime import datetime
import json
import time
import sys

start_time = time.time()

# Initialize a dictionary to store the wait time and number of patients
waitTime_noPatients = {}

# URL 1
url1 = "https://www.ktph.com.sg/SitePages/getQueueViewers.aspx?r=0.645410769075595"
response1 = requests.get(url1)
data1 = response1.json()

waitTime_noPatients['x1'] = data1[0]["WaitingTime"]
waitTime_noPatients['x2'] = data1[0]["PatientCount"]

print(f"Wait Time (KTPH): {waitTime_noPatients['x1']}")
print(f"Patient Count (KTPH): {waitTime_noPatients['x2']}")

# URL 2
url2 = 'https://www.ttsh.com.sg/Patients-and-Visitors/Medical-Services/Emergency/Pages/Emergency%20Medicine.aspx'

# Make a GET request to fetch the page content
page_response2 = requests.get(url2)

# Parse the content using lxml
tree2 = html.fromstring(page_response2.content)

# Define the XPaths
xpath_wait_time2 = '//*[@id="ctl00_ctl49_g_ded02675_64f4_46af_9c99_b2af84c10bf7_ctl00_pnlList"]/div[4]'
xpath_number_patients2 = '//*[@id="ctl00_ctl49_g_ded02675_64f4_46af_9c99_b2af84c10bf7_ctl00_pnlList"]/div[3]'

# Extract the content at the specified XPaths and handle errors
try:
    content_wait_time2 = tree2.xpath(xpath_wait_time2)[0].text_content()
    numbers_wait_time2 = re.findall(r'\d+', content_wait_time2)
    waitTime_noPatients['y1'] = int(numbers_wait_time2[0]) if numbers_wait_time2 else None
except IndexError:
    waitTime_noPatients['y1'] = None

try:
    content_number_patients2 = tree2.xpath(xpath_number_patients2)[0].text_content()
    numbers_number_patients2 = re.findall(r'\d+', content_number_patients2)
    waitTime_noPatients['y2'] = int(numbers_number_patients2[0]) if numbers_number_patients2 else None
except IndexError:
    waitTime_noPatients['y2'] = None

waitTime_noPatients['y1'] = str(waitTime_noPatients['y1'])
waitTime_noPatients['y2'] = str(waitTime_noPatients['y2'])

print(f"Wait Time (TTSH): {waitTime_noPatients['y1']}")
print(f"Patient Count (TTSH): {waitTime_noPatients['y2']}")

# URL 3
url3 = "https://www.wh.com.sg/SitePages/get_QueueViewer.aspx?"
response3 = requests.get(url3)
data3 = response3.json()

waitTime_noPatients['z1'] = data3["QueueViewerItems"][0]["Value"]
waitTime_noPatients['z2'] = data3["QueueViewerItems"][1]["Value"]

print(f"Wait Time (WH): {waitTime_noPatients['z1']}")
print(f"Patient Count (WH): {waitTime_noPatients['z2']}")

# Initialize a list to store the data as an array
data_array = []

# Append the dictionary to the list
data_array.append(waitTime_noPatients)

# Get the current timestamp
current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
waitTime_noPatients['timestamp'] = current_time

# Update the data.json file
with open('data.json', 'w') as json_file:
    json.dump(data_array, json_file, indent=4)

print(data_array)

# Calculate and print the execution time
execution_time = time.time() - start_time
print(f"Data updated in data.json. Execution time: {execution_time:.2f} seconds")

# Check if the script has been running for more than 20 seconds
if time.time() - start_time > 20:
    print("Script has been running for more than 20 seconds. Terminating...")
    sys.exit()
