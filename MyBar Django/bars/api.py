import requests, json
from io import BytesIO
from datetime import datetime

class Api:
        
    def get_bars():
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json?"
        query = "Bar"
        callback="initMap"
        api_key = 'AIzaSyAMPRgLpuErhhf6Bcg9OuS6V97GPOLqsjg'
        try:
            response = requests.get(url + 'query=' + query +'&key=' + api_key + "&callback="+callback)
        except:
            return False
        if response.status_code != 200:
            return False
        return response.json()["results"]
    
    def get_image(ref):
        url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400'
        api_key = 'AIzaSyAMPRgLpuErhhf6Bcg9OuS6V97GPOLqsjg'
        search_image = url+"&photo_reference="+ref+'&key=' + api_key
        try:
            response = requests.get(search_image)
        except:
            return None
        if response.status_code != 200:
            return None
        return response.content
    
    def get_capacity(name, street):
        url = "https://besttime.app/api/v1/forecasts"
        api_key_private="pri_3147e2b6e7e24b4396368d41e129acba"
        api_key_public="pub_e0eda3d510ab42b6b2c1369dfafe59d0"
        params = {
            'api_key_private': api_key_private,
            'venue_name': name,
            'venue_address': street
        }
        try:
            response = requests.request("POST", url, params=params)
        except:
            return None
        if response.status_code != 200:
            return None
        result = response.json()
        capacity = 'No disponible'
        if result['status']=='OK':
            capacity = result['analysis'][datetime.today().weekday()]['hour_analysis'][datetime.now().hour]['intensity_txt']
        elif 'Error: Venue found, but could not forecast this venue.' in result["message"]:
            capacity = 'Bar demasiado nuevo para pronosticar'
        return capacity