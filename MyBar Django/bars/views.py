from numbers import Rational
from django.shortcuts import render
from django.http import JsonResponse
from .api import Api
from .models import Bar, Detail
from django.core.files import File
import os

def get_bars(request):
    bars = Api.get_bars()
    capacities = []
    if not bars:
        return JsonResponse({"valid":False}, status = 400)
    for bar in bars:
        if not Bar.objects.filter(reference=bar['reference'], place_id=bar['place_id'], user=request.user).exists():
            image = None
            if 'photos' in bar:
                ref = (bar['photos'][0]['photo_reference'])
                image = Api.get_image(ref)
                with open('tmp/' + bar['reference'] + '.jpg', 'wb') as f:
                    f.write(image)
                reopen = open('tmp/' + bar['reference'] + '.jpg', 'rb')
                image = File(reopen)
            mybar = Bar.objects.create(reference=bar['reference'], user=request.user, place_id=bar['place_id'], formatted_address=bar['formatted_address'], lat=bar['geometry']['location']['lat'], lng=bar['geometry']['location']['lng'], name=bar['name'], image=image)
        else:
            mybar = Bar.objects.get(reference=bar['reference'], place_id=bar['place_id'], user=request.user)
        price_level = bar['price_level'] if 'price_level' in bar else None
        opening = bar['opening_hours']["open_now"] if 'opening_hours' in bar else None
        capacity = Api.get_capacity(bar['name'], bar['formatted_address'])
        capacities.append({
            'reference': bar['reference'],
            'capacity': capacity
        })
        Detail.objects.create(bar=mybar, price_level=price_level, rating=bar['rating'], user_ratings_total=bar['user_ratings_total'], capacity=capacity, opening=opening)
    return JsonResponse({"valid":True, "bars": bars, "capacities": capacities}, status = 200)

def bar(request, reference):
    bar = Bar.objects.get(reference=reference, user=request.user)
    details = Detail.objects.filter(bar=bar)
    return render(request, 'bars/bar.html', {'bar': bar, 'details': details})

def my_bars(request):
    bars = Bar.objects.filter(user=request.user)
    return render(request, 'bars/my_bars.html', {'bars': bars})