#venv\scripts\activate - USE THIS TO ACTIVATE MY VIRTUAL ENVIRONMENT

from flask import Flask, jsonify, request, send_file
from datetime import datetime
from flask_cors import CORS
import numpy as np
import pandas as pd
import win32com.client as win32
import pythoncom
from openpyxl import Workbook, load_workbook
import os
import tempfile

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route("/api/data", methods=['POST'])
def process_data():
    data = request.json

    filepath = 'database.xlsx'

    data.append({'name': 'GenDate', 'value': datetime.now().strftime("%Y-%m-%d %H:%M:%S")})

    dataColumns = [i['name'] for i in data]

    if not os.path.isfile(filepath):
        column_names = set(d['name'] for d in data)
        data_dict = {name: [] for name in column_names}

        for d in data:
            data_dict[d['name']].append(d['value'])

        df = pd.DataFrame(data_dict)
        df = df.fillna(pd.NA)
        df.to_excel(filepath, index=False)
    else:
        df = pd.read_excel(filepath, engine='openpyxl')
        column_names = df.columns.tolist()
        data_dict = {name: [] for name in column_names}

        for i in column_names:
            if i not in dataColumns:
                data.append({'name': i, 'value': 'Na'})

        for d in data:
            data_dict[d['name']].append(d['value'])

        dfdata = pd.DataFrame(data_dict)
        dfdata = dfdata.fillna(pd.NA)

        wb = load_workbook(filepath)
        ws = wb.active
        datatoAppend = dfdata.values.tolist()

        for row in datatoAppend:
            ws.append(row)
        wb.save(filepath)

    print('working')
    return jsonify({"message": "success"})



@app.route('/download_email_draft')
def download_email_draft():
    pythoncom.CoInitialize()  # Initialize COM library
    print('HELLO')

    # Convert ImmutableMultiDict to a regular dictionary
    data = request.args.to_dict(flat=False)

    # Convert to list of dictionaries
    data_list = []
    for key, value in data.items():
        if '[' in key and ']' in key:
            index = int(key[key.index('[') + 1:key.index(']')])
            subkey = key[key.index(']') + 2:]
            while len(data_list) <= index:
                data_list.append({})
            clean_key = subkey[:-1] if subkey.endswith(']') else subkey
            data_list[index][clean_key] = value[0]  # value is a list, take the first item

    # Append generation date
    data_list.append({'name': 'GenDate', 'value': datetime.now().strftime("%Y-%m-%d %H:%M:%S")})
    print('PRINTING DATA_LIST!!')
    print(data_list)

    # Convert list of dictionaries to DataFrame
    data_dict = {d['name']: [] for d in data_list}
    for d in data_list:
        data_dict[d['name']].append(d['value'])
    df = pd.DataFrame(data_dict)
    df = df.fillna(pd.NA)

    # Use the DataFrame to create email draft
    html_table = df.to_html(index=False)
    print(html_table)


    try:
        # Create an instance of the Outlook application
        outlook = win32.Dispatch("Outlook.Application")

        # Create a new mail item
        mail = outlook.CreateItem(0)
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        headerstr = 'Shift Report for: ' + now_str 

        # Set the mail item properties
        mail.Subject = "Daily Report"
        mail.BodyFormat = 2  # Set the email body format to HTML
        mail.HTMLBody = f"""
        <html>
        <head></head>
        <body>
        <p>{headerstr}</p>
        {html_table}
        </body>
        </html>
        """
        mail.To = "recipient@example.com"

        # Specify the directory where you want to save the temporary file
        custom_dir = 'C:\\Users\\pxie\\Desktop\\shiftreport\\api'  # Change this to your desired directory
        if not os.path.exists(custom_dir):
            os.makedirs(custom_dir)

        # Save the mail item as a draft in the specified directory
        temp_file_path = os.path.join(custom_dir, 'email_draft.msg')  # Changed to .msg format
        try:
            mail.SaveAs(temp_file_path, 3)  # Save as .msg file

            # Return the file as an attachment
            return send_file(temp_file_path, as_attachment=True)
        except Exception as e:
            print(f'Failed to save email draft: {e}')
        finally:
            # Clean up the temporary file if needed
            if os.path.exists(temp_file_path):
               #os.remove(temp_file_path)
               print('SKIP DELETE ')
             
    finally:
        pythoncom.CoUninitialize()  # Uninitialize COM library

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
