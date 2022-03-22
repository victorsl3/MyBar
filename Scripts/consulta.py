from flask import Flask, render_template, request
import requests as req
from Pillow import Image
from io import BytesIO
import json 
import pandas as pd
import numpy as np
import folium

app=Flask(_name_)

def busqueda(req):
    
    api_key = 'AIzaSyAMPRgLpuErhhf6Bcg9OuS6V97GPOLqsjg'

    url = "https://maps.googleapis.com/maps/api/place/textsearch/json?"
    
    query = "Bar"
    callback="initMap"
    
    busqueda = req.get(url + 'query=' + query +'&key=' + api_key + "&callback="+callback)
    r=busqueda.json()["results"]

    nombre=[]
    calle = []
    id = []
    nivel_precio=[]
    calificacion=[]
    numero_calificaciones=[]
    latitud=[]
    longitud=[]
    coordenadas=[]
    tipo = []
    estado=[]
    icon=[]
    abierto=[]
    fotos=[]
    for i in range(len(r)):
        
        nombre.append(r[i]['name'])
        
        calle.append(r[i]['formatted_address'])
        
        id.append(r[i]['place_id'])
        
        latitud.append(r[i]['geometry']['location']['lat'])
        
        longitud.append(r[i]['geometry']['location']['lng'])
        
        coordenadas.append([r[i]['geometry']['location']['lat'],r[i]['geometry']['location']['lng']])
        
        tipo.append(r[i]['types'])
        
        estado.append(r[i]['business_status'])
        
        icon.append(Image.open(BytesIO(req.get(r[i]['icon']).content)))
        
        if "price_level" in r[i]:
            nivel_precio.append(r[i]['price_level'])
        else:
            nivel_precio.append(np.nan)
            
        calificacion.append(r[i]['rating'])
        
        numero_calificaciones.append(r[i]['user_ratings_total'])
        
        if "opening_hours" in r[i]:
            abierto.append(r[i]['opening_hours']["open_now"])
        else:
            abierto.append("Desconocido")
        
        if "photos" in r[i]:
            ref=(r[i]["photos"][0]["photo_reference"])
            url_foto="https://maps.googleapis.com/maps/api/place/photo?maxwidth=400"
            busqueda_foto=req.get(url_foto+"&photo_reference="+ref+'&key=' + api_key)
            fotos.append(busqueda_foto.content)
        else:
            fotos.append(np.nan)

    df = pd.DataFrame(data={
        "nombre":nombre,
        'calle':calle,
        'id':id,
        "disponibilidad":abierto,
        "tipo":tipo,
        'coordenadas':coordenadas,
        "longitud":longitud,
        "latitud": latitud,
        "estado":estado,
        "icono":icon,
        "nivel_precio":nivel_precio,
        "calificacion":calificacion,
        "numero_calificaciones":numero_calificaciones,
        "foto":fotos
        })
    df["disponibilidad"]=df["disponibilidad"].replace(True, "Abierto")
    df["disponibilidad"]=df["disponibilidad"].replace(False, "Cerrado")
    df.head()

    df.size

    cp=[]
    for n in df["calle"]:
        subcadena = n[n.index('Madrid')-6:n.index('Madrid')]
        cp.append(subcadena)
    df['cp']=cp
    df.head()

    df.to_csv("muestra.csv")

    m=folium.Map(
        location=[40.434837, -3.6799],
        tiles="Stamen Terrain",
        zoom_start=15
    )

    for i in range(0,len(df["coordenadas"])):
        tooltip = df["nombre"][i]
        popup=df["nombre"][i]+"\t"+df["disponibilidad"][i]+"\t Calificación:"+str(df["calificacion"][i])
        folium.Marker(df["coordenadas"][i], popup=popup, tooltip=tooltip).add_to(m)

    m