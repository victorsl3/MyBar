#Librerías
from flask import Flask
import requests as req
#from Pillow import Image
import json 
import pandas as pd
import numpy as np
import folium

#Flask
app=Flask(__name__)
@app.route('/')

def busqueda():

    #Parámetros
    api_key = 'AIzaSyAMPRgLpuErhhf6Bcg9OuS6V97GPOLqsjg'
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json?"
    query = "Bar"
    callback="initMap"
    
    #Búsqueda
    busqueda = req.get(url + 'query=' + query +'&key=' + api_key + "&callback="+callback)
    r=busqueda.json()["results"]

    #Variables
    nombre=[]
    calle = []
    id_bar = []
    nivel_precio=[]
    calificacion=[]
    numero_calificaciones=[]
    latitud=[]
    longitud=[]
    coordenadas=[]
    tipo = []
    estado=[]
    abierto=[]
    fotos=[]

    for i in range(len(r)):
        #Nombre
        nombre.append(r[i]['name'])

        #Calle
        calle.append(r[i]['formatted_address'])

        #Id
        id_bar.append(r[i]['place_id'])

        #Coordenadas
        latitud.append(r[i]['geometry']['location']['lat'])
        longitud.append(r[i]['geometry']['location']['lng'])
        coordenadas.append([r[i]['geometry']['location']['lat'],r[i]['geometry']['location']['lng']])

        #Tipo
        tipo.append(r[i]['types'])

        #Estado
        estado.append(r[i]['business_status'])
        
        #Nivel de precio
        if "price_level" in r[i]:
            nivel_precio.append(r[i]['price_level'])
        else:
            nivel_precio.append(np.nan)
        
        #Calificaciones
        calificacion.append(r[i]['rating'])
        numero_calificaciones.append(r[i]['user_ratings_total'])
        
        #Abierto
        if "opening_hours" in r[i]:
            abierto.append(r[i]['opening_hours']["open_now"])
        else:
            abierto.append("Desconocido")
        
        #Fotos
        if "photos" in r[i]:
            ref=(r[i]["photos"][0]["photo_reference"])
            url_foto="https://maps.googleapis.com/maps/api/place/photo?maxwidth=400"
            busqueda_foto=req.get(url_foto+"&photo_reference="+ref+'&key=' + api_key)
            fotos.append(busqueda_foto.content)
        else:
            fotos.append(np.nan)

    # Creación del dataframe
    df = pd.DataFrame(data={
        "nombre":nombre,
        'calle':calle,
        'id':id_bar,
        "disponibilidad":abierto,
        "tipo":tipo,
        'coordenadas':coordenadas,
        "longitud":longitud,
        "latitud": latitud,
        "estado":estado,
        "nivel_precio":nivel_precio,
        "calificacion":calificacion,
        "numero_calificaciones":numero_calificaciones,
        "foto":fotos
        })

    # Limpieza
    df["disponibilidad"]=df["disponibilidad"].replace(True, "Abierto")
    df["disponibilidad"]=df["disponibilidad"].replace(False, "Cerrado")
    cp=[]
    for n in df["calle"]:
        subcadena = n[n.index('Madrid')-6:n.index('Madrid')]
        cp.append(subcadena)
    df['cp']=cp

    #Mapa
    m=folium.Map(
        location=df.iloc[0].coordenadas,
        tiles="Stamen Terrain",
        zoom_start=15
    )
    for i in range(0,len(df["coordenadas"])):
        tooltip = df["nombre"][i]
        popup=df["nombre"][i]+"\t"+df["disponibilidad"][i]+"\t Calificación:"+str(df["calificacion"][i])
        folium.Marker(df["coordenadas"][i], popup=popup, tooltip=tooltip).add_to(m)


    return df.to_csv("muestra.csv"), m

