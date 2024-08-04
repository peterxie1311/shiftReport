#C:\Users\pxie\Desktop\shiftReport\api\venv\Scripts\activate
from flask import Flask, jsonify, request, send_file
from datetime import datetime
from flask_cors import CORS
import pandas as pd
import socket
# import win32com.client as win32
# import pythoncom
import os

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
mailTo = "coles_bri_lcc@witron.com"
mailCc = "coles_bri_lcc@witron.com"
namesList="nameslist.csv"


#PLEASE DO NOT USE THIS ANYMORE -----------------------------------------------------------------------------

# Define a function to get the filename based on some criteria
def getFilename(array):
    filename =''
    indexRemoval = 0
    array.append({'name': 'GenDate', 'value': datetime.now().strftime("%Y-%m-%d %H:%M:%S")})
    for index, element in enumerate(array):
        if element['name'] == 'Report type':
            filename = element['value']
            
            indexRemoval = index
    array.pop(indexRemoval)
    return f"{filename}.csv"

@app.route("/api/data", methods=['POST'])
def process_data():
    data = request.json
    filepath = getFilename(data)
    
    dataColumns = [i['name'] for i in data]
    if not os.path.isfile(filepath):
        column_names = set(d['name'] for d in data)
        data_dict = {name: [] for name in column_names}

        for d in data:
            if len(data_dict[d['name']]) == 0:
                data_dict[d['name']].append(d['value'])

        df = pd.DataFrame(data_dict)
        df = df.fillna(pd.NA)
        df.to_csv(filepath, index=False)
    else:
        df = pd.read_csv(filepath)
        column_names = df.columns.tolist()
        data_dict = {name: [] for name in column_names}

        for i in column_names:
            if i not in dataColumns:
                data.append({'name': i, 'value': 'Na'})

        for d in data:
            if len(data_dict[d['name']]) == 0:
                data_dict[d['name']].append(d['value'])

        dfdata = pd.DataFrame(data_dict)
        dfdata = dfdata.fillna(pd.NA)

        df = pd.concat([df, dfdata], ignore_index=True)
        df.to_csv(filepath, index=False)

    return jsonify({"message": "success"})

#PLEASE DO NOT USE THIS ANYMORE ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

@app.route("/api/processNames", methods=['POST'])
def process_Names():
    try:
        print("working")
        data = request.json
        array = data.get('array', [])
        filename = data.get('filename', '')
        # Process the array and filename as needed
        print("Received array:", array)
        print("Received filename:", filename)

        df = pd.DataFrame(array)
        df.to_csv(filename, index=False)
        return jsonify({"message": f"Process Complete: {filename}"})
    except Exception as e:
        return jsonify({"message": f"process_Names Function failed exception:{e} filename:{filename}"})
    
    

@app.route("/api/appendDB", methods=['POST'])
def appendDf():
    try:
        data = request.json
        gendate = {'Gen Date':  datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
        array = data.get('array', [])
        filename = data.get('filename', '')
        crew = data.get('crew','')
        workedCrew ={'Worked on Crew':  crew}
       # print(crew)
        #print(array)
        for i in array:
            i.update(gendate)
            i.update(workedCrew)
        append = pd.DataFrame(array)
        if os.path.isfile(filename):
            file=pd.read_csv(filename)
            df = pd.concat([file, append], ignore_index=True)
            df.to_csv(filename, index=False)
        else:
            append.to_csv(filename, index=False)

        return jsonify({"message": f"Appended df {crew}"})
    except Exception as e:
        return jsonify({"message": f"Failed exception:{e} Crew:{crew}"})
    

@app.route('/api/getReport',methods=['GET'])
def getReport():
    
    print('Hello')
    directory_path = 'so01' # r'\\wms-app1-w19.dc9462wmsdom.local\WMS-MEDIA\bmis\export\SO01 EXPORT' need to change to this on the production server 
    # collect the latest file in the directory:
    latest_file = None
    latest_mod_date = None
    latest_file_path = ""

    # Iterate through files and find the latest modification date
    for file_name in os.listdir(directory_path):
        file_path = os.path.join(directory_path, file_name)
        if os.path.isfile(file_path):
            mod_time = os.path.getmtime(file_path)
            mod_date = datetime.fromtimestamp(mod_time)
            if latest_mod_date is None or mod_date > latest_mod_date:
                latest_mod_date = mod_date
                latest_file = file_name
                latest_file_path = file_path

    df = pd.read_csv('C:\\Users\\pxie\\Desktop\\shiftReport\\api\\so01\\so01_20240730050000_20240731111401.csv', encoding='iso-8859-1',skipfooter=2, engine='python') # df = pd.read_csv(latest_file_path, encoding='iso-8859-1',skipfooter=1 , engine='python')


    print(df)

    generalInfo = {'Shift Comments and General Information':f'File Name: {latest_file} Mod Date: {latest_mod_date} filepath: {latest_file_path}'}
    sumCasesAll = {'Cases All':df['Cases All'].sum()}
    inbPals = {'Pallets Received':df['Inb. pallets'].sum()}
    # Generate dynamic keys and values
    df['COM cases sum'] = df['COM cases sum'].fillna(0)
    df['Depal. cases'] = df['Depal. cases'].fillna(0)
    df['AIO cases sum'] = df['AIO cases sum'].fillna(0)
    df['RPK cases'] = df['RPK cases'].fillna(0)
    kpi1_keys = [f'KPI1 Hour {i+1}' for i in range(len(df))]
    kpi1_values = df['COM cases sum'].tolist()

    kpi2_keys = [f'KPI2 Hour {i+1}' for i in range(len(df))]
    kpi2_values = df['Depal. cases'].tolist()

    kpi3_keys = [f'KPI3 Hour {i+1}' for i in range(len(df))]
    kpi3_values = df['AIO cases sum'].tolist()

    kpi4_keys = [f'KPI4 Hour {i+1}' for i in range(len(df))]
    kpi4_values = df['RPK cases'].tolist()
    kpi1 = dict(zip(kpi1_keys, kpi1_values))
    kpi2 = dict(zip(kpi2_keys, kpi2_values))
    kpi3 = dict(zip(kpi3_keys, kpi3_values))
    kpi4 = dict(zip(kpi4_keys, kpi4_values))
    combined_data = {**kpi1, **kpi2, **kpi3, **kpi4, **generalInfo,**sumCasesAll,**inbPals}
    
    df = pd.DataFrame([combined_data])
   
    json_data = df.to_json(orient='records')
    return jsonify(json_data)


#PLEASE START USING GETNAMES!

@app.route('/api/getNames',methods=['GET'])
def getNames():
    try:
        data = request.args.to_dict(flat=False)
        filename = data['data'][0]
        #return jsonify({"message":f"getNames exception: {e}"})
       
        file_path = os.path.join(os.getcwd(), filename)
        df = pd.read_csv(file_path)
        json_data = df.to_json(orient='records')
        return jsonify(json_data)
    except Exception as e :
        return jsonify ({"message":f"getNames exception: {e}"}),400


def getIP():
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))  # Google's DNS server, just for the purpose of getting the local IP
        local_ip = s.getsockname()[0]
        with open('ip.txt', 'w') as file:
            file.write(f'http://{local_ip}:8080')
        s.close()
    except Exception as e:
        print(f"Could not determine local IP address: {e}")

       

@app.route('/api/download_email_draft',methods=['GET'])
def download_email_draft():
    return jsonify ({"message":f"DONT HAVE THIS ON MAC "}),400
    # pythoncom.CoInitialize()  # Initialize COM library

    # # Convert ImmutableMultiDict to a regular dictionary
    # data = request.args.to_dict(flat=False)

    # # Convert to list of dictionaries
    # data_list = []
    # for key, value in data.items():
    #     if '[' in key and ']' in key:
    #         index = int(key[key.index('[') + 1:key.index(']')])
    #         subkey = key[key.index(']') + 2:]
    #         while len(data_list) <= index:
    #             data_list.append({})
    #         clean_key = subkey[:-1] if subkey.endswith(']') else subkey
    #         data_list[index][clean_key] = value[0]  # value is a list, take the first item

    # # Append generation date
    # data_list.append({'name': 'GenDate', 'value': datetime.now().strftime("%Y-%m-%d %H:%M:%S")})

    # # Convert list of dictionaries to DataFrame
    # data_dict = {d['name']: [] for d in data_list}
    # for d in data_list:
    #     data_dict[d['name']].append(d['value'])
    # df = pd.DataFrame(data_dict)
    # df = df.fillna(pd.NA)

    # # Use the DataFrame to create email draft
    # html_table = df.to_html(index=False)

    # dfTable = ''
    # for i, r in df.iterrows():
    #     for col_name, value in r.items():
    #         dfTable += f"<tr>\n"
    #         dfTable += f"<td>{col_name}</td>\n"
    #         dfTable += f"<td>{value}</td>\n"
    #         dfTable += f"</tr>"

    # table = f"""
    #         <html>
    #         <head>
    #         <style>
    #             table {{
    #                 width: 100%;
    #                 border-collapse: collapse;
    #             }}
    #             th, td {{
    #                 padding: 10px;
    #                 text-align: left;
    #                 border: 1px solid #ddd;
    #             }}
    #             tr:nth-child(even) {{
    #                 background-color: #f2f2f2;
    #             }}
    #             th {{
    #                 background-color: #213547;
    #                 color: white;
    #             }}
    #         </style>
    #         </head>
    #         <body>
    #         <p>Shift Report for: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
    #         <table class="dataframe">
    #             <thead>
    #                 <tr>
    #                     <th>Column</th>
    #                     <th>Value</th>
    #                 </tr>
    #             </thead>
    #             <tbody>
    #                 {dfTable}
    #             </tbody>
    #         </table>
    #         </body>
    #         </html>
    #         """

    # html_content = f"""
    # <html>
    # <head></head>
    # <body>
    # <p>Shift Report for: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
    # {table}
    # </body>
    # </html>
    # """
    
    # # Print the HTML content to ensure it's well-formed

    # try:
    #     # Create an instance of the Outlook application
    #     outlook = win32.Dispatch("Outlook.Application")
    #     # Create a new mail item
    #     mail = outlook.CreateItem(0)
    #     now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    #     headerstr = 'Shift Report for: ' + now_str 

    #     # Set the mail item properties
    #     mail.Subject = "Daily Report"
    #     mail.BodyFormat = 2  # Set the email body format to HTML
    #     mail.HTMLBody = table
    #     mail.To = mailTo
    #     mail.Cc = mailCc

    #     # Specify the directory where you want to save the temporary file
    #     custom_dir = 'C:\\Users\\pxie\\Desktop\\shiftreport\\api'  # Change this to your desired directory 'C:\\Users\\localuser\\Desktop\\shiftReport\\api'
    #     if not os.path.exists(custom_dir):
    #         os.makedirs(custom_dir)

    #     # Save the mail item as a draft in the specified directory
    #     temp_file_path = os.path.join(custom_dir, 'email_draft.msg')  # Changed to .msg format
    #     try:
    #         mail.SaveAs(temp_file_path, 3)  # Save as .msg file

    #         # Return the file as an attachment
    #         return send_file(temp_file_path, as_attachment=True)
    #     except Exception as e:
    #         return jsonify({"message":"Error in email drafts {e}"})
       
    # finally:
    #     pythoncom.CoUninitialize()  # Uninitialize COM library

if __name__ == '__main__':
    getIP()
    app.run(host='0.0.0.0', port=8080, debug=True)

    
