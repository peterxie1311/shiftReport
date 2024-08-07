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
mailTo = "coles_bri_lcc@witron.com"
mailCc = "coles_bri_lcc@witron.com"

@app.route("/api/data", methods=['POST'])
def process_data():
    data = request.json

    filepath = 'database.csv'

    data.append({'name': 'GenDate', 'value': datetime.now().strftime("%Y-%m-%d %H:%M:%S")})

    dataColumns = [i['name'] for i in data]
   

    #print('THIS IS WHERE TO CHECK')
    #print(dataColumns)
    #print('DATA!!!')
    #print(data)

    if not os.path.isfile(filepath):
        column_names = set(d['name'] for d in data)
        data_dict = {name: [] for name in column_names}

        for d in data:
            data_dict[d['name']].append(d['value'])

        print(data_dict)    

        df = pd.DataFrame(data_dict)
        df = df.fillna(pd.NA)
        df.to_csv(filepath, index=True)
    else:
        df = pd.read_csv(filepath)
        column_names = df.columns.tolist()
        data_dict = {name: [] for name in column_names}

        for i in column_names:
            if i not in dataColumns:
                data.append({'name': i, 'value': 'Na'})

        for d in data:
            data_dict[d['name']].append(d['value'])

        dfdata = pd.DataFrame(data_dict)
        dfdata = dfdata.fillna(pd.NA)

        df = pd.concat([df, dfdata], ignore_index=True)
        df.to_csv(filepath, index=False)

    return jsonify({"message": "success"})



@app.route('/download_email_draft')
def download_email_draft():
    pythoncom.CoInitialize()  # Initialize COM library
    #print('HELLO')

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
    #print('PRINTING DATA_LIST!!')
   # print(data_list)

    # Convert list of dictionaries to DataFrame
    data_dict = {d['name']: [] for d in data_list}
    for d in data_list:
        data_dict[d['name']].append(d['value'])
    df = pd.DataFrame(data_dict)
    df = df.fillna(pd.NA)

    # Use the DataFrame to create email draft
    html_table = df.to_html(index=False)
    #print(html_table)

    dfTable=''
    for i,r in df.iterrows():
        for col_name, value in r.items():
            dfTable += f"<tr>\n"
            dfTable += f"<td>{col_name}</td>\n"
            dfTable += f"<td>{value}</td>\n"
            dfTable += f"</tr>"
           # print(f"Column: {col_name}, Value: {value}")

    table = f"""
            <html>
            <head>
            <style>
                table {{
                    width: 100%;
                    border-collapse: collapse;
                }}
                th, td {{
                    padding: 10px;
                    text-align: left;
                    border: 1px solid #ddd;
                }}
                tr:nth-child(even) {{
                    background-color: #f2f2f2;
                }}
                th {{
                    background-color: #213547;
                    color: white;
                }}
            </style>
            </head>
            <body>
            <p>Shift Report for: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
            <table class="dataframe">
                <thead>
                    <tr>
                        <th>Column</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {dfTable}
                </tbody>
            </table>
            </body>
            </html>
            """

    html_content = f"""
    <html>
    <head></head>
    <body>
    <p>Shift Report for: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
    {table}
    </body>
    </html>
    """
    
    # Print the HTML content to ensure it's well-formed
    print(table)



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
        mail.HTMLBody = table
        mail.To = mailTo
        mail.Cc = mailCc


        # Specify the directory where you want to save the temporary file
        custom_dir = 'C:\\Users\\pxie\\Desktop\\shiftreport\\api'  # Change this to your desired directory
        if not os.path.exists(custom_dir):
            os.makedirs(custom_dir)

        # Save the mail item as a draft in the specified directory
        temp_file_path = os.path.join(custom_dir, 'email_draf123t.msg')  # Changed to .msg format
        try:
            mail.SaveAs(temp_file_path, 3)  # Save as .msg file

            # Return the file as an attachment
            return send_file(temp_file_path, as_attachment=True)
        except Exception as e:
            print(f'Failed to save email draft: {e}')
       
    finally:
        pythoncom.CoUninitialize()  # Uninitialize COM library

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
