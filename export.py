import requests

r = open('daylio_export.csv', 'r')
lines = r.readlines()
estado = {}
sourceDb = "https://bdethos-default-rtdb.firebaseio.com/status.json"

nombres = {
    "Alegre":"Alegre",
    "Motivado":"Excelente",
    "Pos bien": "Bien",
    "como siempre":"Normal",
    "Sin animo":"Ansioso",
    "mal":"Ansioso",
    "ansioso":"Mal",
    "una mierda":"Una Mierda"
}

niveles = {
    "Alegre":7,
    "Motivado":6,
    "Pos bien":5,
    "como siempre":4,
    "Sin animo":3,
    "mal":3,
    "ansioso":2,
    "una mierda":1
}

for l in lines[::-1]:
    columns = l.split(",")
    fecha = columns[2]+", "+columns[1]+". de 2021"
    estado['Fecha'] = fecha
    estado['Estado'] = nombres[columns[4]]
    estado['Nivel'] = niveles[columns[4]]

    print(estado)
    if(requests.post(sourceDb,json = estado).status_code == 200):
        print(estado)
r.close()
