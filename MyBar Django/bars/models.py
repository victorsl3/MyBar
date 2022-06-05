from django.db import models
from django.contrib.auth.models import User

class Bar(models.Model):
    reference = models.CharField(max_length=150)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    place_id = models.CharField(max_length=150)
    formatted_address = models.TextField()
    lat = models.CharField(max_length=50)
    lng = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='bars', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return "%s %s %s %s" % (self.user.username, self.reference, self.name, self.created_at)
    
class Detail(models.Model):
    bar = models.ForeignKey(Bar,on_delete=models.CASCADE)
    price_level = models.IntegerField(null=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, null=True)
    user_ratings_total = models.IntegerField(null=True)
    capacity = models.CharField(max_length=50, null=True)
    opening = models.BooleanField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return "%s %s %s" % (self.bar.user.username,self.bar.name, self.created_at)