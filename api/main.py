#venv\scripts\activate - USE THIS TO ACTIVATE MY VIRTUAL ENVIRONMENT

from flask import Flask, jsonify,request
from datetime import datetime 
from flask_cors import CORS
import numpy as np
import pandas as pd
from openpyxl import Workbook, load_workbook
import os
 
app = Flask(__name__)
cors = CORS(app,origins='*')




@app.route("/api/data", methods=['POST'])
def process_data():
    data = request.json 

    filepath = 'database.xlsx'

    data.append({'name':'GenDate' ,'value' :  datetime.now().strftime("%Y-%m-%d %H:%M:%S")})

    dataColumns = []


    for i in data:
        dataColumns.append(i['name'])


   
    
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
            check = False
            for j in dataColumns:
                if i == j:
                    check = True
            if check == True:
                check = False
            else:
                data.append({'name':i,'value':'Na'})


        for d in data:
            data_dict[d['name']].append(d['value'])

        dfdata = pd.DataFrame(data_dict)
        dfdata = dfdata.fillna(pd.NA)
        #newdf = pd.concat([df, dfdata])

        wb = load_workbook(filepath)
        ws = wb.active
        datatoAppend = dfdata.values.tolist()

        for row in datatoAppend:
            ws.append(row)
        wb.save(filepath)


    
        


    

    
    
     

   
    

    
    
    print('working')

    print(type(data[0]))
   
    return jsonify({"message": "Array data received and processed successfully"})
 
if __name__ == "__main__":
    app.run(debug=True, port=8080)