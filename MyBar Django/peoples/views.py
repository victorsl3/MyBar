from django.shortcuts import render
from django.http import JsonResponse
from datetime import datetime
import pandas
import json


def get_peoples(request):
    now = datetime.now()
    data = pandas.read_csv('static/csv/PEATONES_2022_COMPLETO.csv', sep=';').drop(['Unnamed: 0'], axis=1)
    data['FECHA'] = pandas.to_datetime(data['FECHA'])
    data['YEAR'] = data['FECHA'].dt.year
    data['MONTH'] = data['FECHA'].dt.month
    data['DAY'] = data['FECHA'].dt.day
    data['HOUR'] = data['FECHA'].dt.hour
    data_filter = data[data.YEAR.eq(now.year)]
    data_filter = data_filter[data_filter.MONTH.eq(now.month)]
    data_filter = data_filter[data_filter.DAY.eq(now.day)]
    data_filter = data_filter[data_filter.HOUR.eq(now.hour)]
    data_filter = data_filter.to_json(orient='records')
    data_filter = json.loads(data_filter)
    return JsonResponse({"valid":True, "data": data_filter}, status = 200)